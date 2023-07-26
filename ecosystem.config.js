module.exports = {
  apps: [
    {
      script: "nodemon start",
    },
  ],

  deploy: {
    production: {
      password: "password.pem",
      user: "ubuntu",
      host: "54.153.181.177",
      ref: "origin/master",
      repo: "https://github.com/AbhishekJha-45/api-server",
      path: "home/ubuntu",
      "pre-deploy-local": "",
      "post-deploy":
        "source ~/.nvm/nvm.sh && npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "ForwardAgent=yes",
    },
  },
};
