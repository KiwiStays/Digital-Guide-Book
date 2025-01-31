module.exports = {
    apps: [
      {
        name: "kiwistays",
        script: "src/index.js",
        env: {
            MONGO_URI: "mongodb+srv://smdakhtar007:sabir123@digitalguide.uisoz.mongodb.net/?retryWrites=true&w=majority&appName=DigitalGuide",
            PORT : 3000,
            CLOUDINARY_API_SECRET: "iZn4zeu_xe7xgDoI1XybXkDle1Q",
            CLOUDINARY_API_KEY :  "978964983727768",
            CLOUDINARY_CLOUD_NAME : "dofznncaw",
            CLOUDINARY_URL :"cloudinary://978964983727768:iZn4zeu_xe7xgDoI1XybXkDle1Q@dofznncaw",
            JWT_SECRET: "yourSecretKey"
        }
      }
    ]
  };