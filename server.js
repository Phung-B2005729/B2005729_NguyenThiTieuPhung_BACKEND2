const app = require("./app");
const config = require("./app/config");


const PORT =  config.app.port;
app.listen(PORT, () => {
    console.log(`Server in runnig on port ${PORT}.`);
});