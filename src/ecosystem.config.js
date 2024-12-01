// env для локальной разработки

module.exports = {
  apps: [
    {
      name: "express",
      script: "./app.js",
      error_file: "/var/log/pm2_err.log",
      out_file: "/var/log/pm2_out.log",
      watch: true,
      watch_options: {
        usePolling: true,
      },
      args: "",
      cwd: "/src/",
      ignore_watch: [
        "package-lock.json",
        "package.json",
        "node_modules",
        ".git",
        "public",
        "logs"
      ],
    },
  ],
};
