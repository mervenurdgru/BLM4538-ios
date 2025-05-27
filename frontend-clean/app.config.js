export default {
    expo: {
      name: "my-app",
      slug: "my-app",
      version: "1.0.0",
      orientation: "portrait",
      scheme: "myapp",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      plugins: ["expo-barcode-scanner"],
      extra: {
        API_URL: process.env.API_URL,
      },
    },
  };
  