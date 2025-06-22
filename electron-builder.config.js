
module.exports = {
  appId: "com.housie.admin",
  productName: "Housie Admin Dashboard",
  directories: {
    output: "dist-electron"
  },
  files: [
    "dist/**/*",
    "src/electron/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  extraMetadata: {
    main: "src/electron/main.js"
  },
  mac: {
    category: "public.app-category.business",
    icon: "public/icon.png",
    target: [
      {
        target: "dmg",
        arch: ["x64", "arm64"]
      }
    ]
  },
  win: {
    icon: "public/icon.png",
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ]
  },
  linux: {
    icon: "public/icon.png",
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      }
    ]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};
