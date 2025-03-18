import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAdminData } from '../../context/admin/AdminDataContext';
import { Category } from '../../types';
import { IconRenderer } from '../../utils/IconRenderer';

const PageContainer = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

const ActionButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid #f1f1f1;
  color: #7f8c8d;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #f1f1f1;
  color: #34495e;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $color: string }>`
  background-color: ${(props) => props.$color};
  color: white;
  border: none;
  border-radius: 5px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => props.$active ? '#B7F9C9' : '#f1f1f1'};
  color: ${(props) => props.$active ? '#0A7A27' : '#7f8c8d'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  
  &:hover {
    color: #34495e;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #7f8c8d;
  }
`;

const SaveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    active: true
  });
  
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategoryId(null);
    setFormData({
      name: '',
      description: '',
      active: true
    });
    setIsModalOpen(true);
  };
  
  const openEditModal = (category: Category) => {
    setIsEditing(true);
    setCurrentCategoryId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
      active: category.active
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentCategoryId !== null) {
      updateCategory(currentCategoryId, formData);
    } else {
      addCategory(formData);
    }
    
    closeModal();
  };
  
  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id);
    }
  };
  
  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    updateCategory(id, { active: !currentStatus });
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gerenciar Categorias</PageTitle>
        <ActionButton onClick={openAddModal}>
          <IconRenderer icon={FaPlus} size={14} />
          Nova Categoria
        </ActionButton>
      </PageHeader>
      
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nome</Th>
              <Th>Descrição</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <Td>#{category.id}</Td>
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
                <Td>
                  <StatusBadge $active={category.active}>
                    {category.active ? 'Ativo' : 'Inativo'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ButtonGroup>
                    <IconButton 
                      $color="#3498db" 
                      onClick={() => openEditModal(category)}
                      title="Editar"
                    >
                      <IconRenderer icon={FaEdit} size={14} />
                    </IconButton>
                    
                    <IconButton 
                      $color={category.active ? '#e74c3c' : '#2ecc71'} 
                      onClick={() => handleToggleStatus(category.id, category.active)}
                      title={category.active ? 'Desativar' : 'Ativar'}
                    >
                      {category.active ? 
                        <IconRenderer icon={FaTimes} size={14} /> : 
                        <IconRenderer icon={FaCheck} size={14} />
                      }
                    </IconButton>
                    
                    <IconButton 
                      $color="#e74c3c" 
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Excluir"
                    >
                      <IconRenderer icon={FaTrash} size={14} />
                    </IconButton>
                  </ButtonGroup>
                </Td>
              </tr>
            ))}
            
            {categories.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: 'center' }}>
                  Nenhuma categoria encontrada
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
      
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome</Label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <CheckboxGroup>
                  <Checkbox 
                    type="checkbox" 
                    id="active" 
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="active" style={{ margin: 0 }}>Ativo</Label>
                </CheckboxGroup>
              </FormGroup>
              
              <ButtonsContainer>
                <CancelButton type="button" onClick={closeModal}>
                  Cancelar
                </CancelButton>
                <SaveButton type="submit">
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </SaveButton>
              </ButtonsContainer>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CategoriesPage; 