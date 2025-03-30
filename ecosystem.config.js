module.exports = {
  apps: [{
    name: "cake-shop",
    script: "server.js",
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    },
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true,
    error_file: "logs/error.log",
    out_file: "logs/output.log"
  }]
}; 