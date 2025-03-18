import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAdminData } from '../../context/admin/AdminDataContext';
import { Product } from '../../types';
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
  overflow-x: auto;
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
  white-space: nowrap;
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

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
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
  overflow-y: auto;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const Select = styled.select`
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

const CurrentImage = styled.div`
  margin-top: 0.5rem;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    margin-top: 0.5rem;
  }
`;

const PriceInput = styled.div`
  position: relative;
  
  span {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
  
  input {
    padding-left: 2rem;
  }
`;

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  stock: number;
  active: boolean;
}

const ProductsPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    image: '',
    categoryId: 0,
    stock: 0,
    active: true
  });
  
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    
    // Se houver categorias, selecione a primeira por padrão
    const defaultCategoryId = categories.length > 0 ? categories[0].id : 0;
    
    setFormData({
      name: '',
      price: 0,
      description: '',
      image: '',
      categoryId: defaultCategoryId,
      stock: 10,
      active: true
    });
    
    setIsModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      categoryId: product.categoryId,
      stock: product.stock,
      active: product.active
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
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
    
    if (isEditing && currentProductId !== null) {
      updateProduct(currentProductId, formData);
    } else {
      addProduct(formData);
    }
    
    closeModal();
  };
  
  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
    }
  };
  
  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    updateProduct(id, { active: !currentStatus });
  };
  
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };
  
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Preparar produtos com categorias
  const productsWithCategories = products.map(product => ({
    ...product,
    categoryName: getCategoryName(product.categoryId)
  }));
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gerenciar Produtos</PageTitle>
        <ActionButton onClick={openAddModal}>
          <IconRenderer icon={FaPlus} size={14} />
          Novo Produto
        </ActionButton>
      </PageHeader>
      
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Imagem</Th>
              <Th>Nome</Th>
              <Th>Categoria</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {productsWithCategories.map(product => (
              <tr key={product.id}>
                <Td>
                  <ProductImage src={product.image} alt={product.name} />
                </Td>
                <Td>{product.name}</Td>
                <Td>{product.categoryName}</Td>
                <Td>{formatCurrency(product.price)}</Td>
                <Td>{product.stock}</Td>
                <Td>
                  <StatusBadge $active={product.active}>
                    {product.active ? 'Ativo' : 'Inativo'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ButtonGroup>
                    <IconButton 
                      $color="#3498db" 
                      onClick={() => openEditModal(product)}
                      title="Editar"
                    >
                      <IconRenderer icon={FaEdit} size={14} />
                    </IconButton>
                    
                    <IconButton 
                      $color={product.active ? '#e74c3c' : '#2ecc71'} 
                      onClick={() => handleToggleStatus(product.id, product.active)}
                      title={product.active ? 'Desativar' : 'Ativar'}
                    >
                      {product.active ? 
                        <IconRenderer icon={FaTimes} size={14} /> : 
                        <IconRenderer icon={FaCheck} size={14} />
                      }
                    </IconButton>
                    
                    <IconButton 
                      $color="#e74c3c" 
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Excluir"
                    >
                      <IconRenderer icon={FaTrash} size={14} />
                    </IconButton>
                  </ButtonGroup>
                </Td>
              </tr>
            ))}
            
            {products.length === 0 && (
              <tr>
                <Td colSpan={7} style={{ textAlign: 'center' }}>
                  Nenhum produto encontrado
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
                {isEditing ? 'Editar Produto' : 'Novo Produto'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select 
                    id="categoryId" 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.filter(c => c.active).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="price">Preço</Label>
                  <PriceInput>
                    <span>R$</span>
                    <Input 
                      type="number" 
                      id="price" 
                      name="price"
                      min="0" 
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </PriceInput>
                </FormGroup>
              </FormGrid>
              
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
                <Label htmlFor="image">URL da Imagem</Label>
                <Input 
                  type="text" 
                  id="image" 
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
                
                {formData.image && (
                  <CurrentImage>
                    <img src={formData.image} alt="Prévia do produto" />
                  </CurrentImage>
                )}
              </FormGroup>
              
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="stock">Estoque</Label>
                  <Input 
                    type="number" 
                    id="stock" 
                    name="stock"
                    min="0" 
                    value={formData.stock}
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
                    <Label htmlFor="active" style={{ margin: 0 }}>Produto ativo</Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormGrid>
              
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

export default ProductsPage; 