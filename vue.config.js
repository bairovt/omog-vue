module.exports = {
    /* to configure ui/public as a static assets folder */
    // configureWebpack: {
    //     plugins: [
    //         new CopyWebpackPlugin([{
    //             from: path.join(__dirname, "public"),
    //             to: path.join(__dirname, "dist"),
    //             toType: "dir",
    //             ignore: ['upload/**/*.*', '.DS_Store']
    //         }])
    //     ]
    // },

    /* to configure ui/public as the location of the template */
    // chainWebpack: config => {
    //   config.plugin("html")
    //     .tap(args => {
    //       args[0].template = path.join(__dirname,"ui/public/index.html");
    //       return args;
    //     })
    // }
}