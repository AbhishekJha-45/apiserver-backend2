module.exports = {
  apps: [
    {
      script: "nodemon start",
    },
  ],

  deploy: {
    production: {
      key: "password.pem",
      user: "ubuntu",
      host: "13.210.60.144",
      ref: "origin/main",
      repo: "https://github.com/AbhishekJha-45/apiserver-backend2.git",
      path: "home/ubuntu",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
