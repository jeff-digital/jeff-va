module.exports = {
    content: [
        "./index.html",
        "./certificate.html",
        "./js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                navy: "#1a2340",
                blueAccent: "#2196F3"
            },
            fontFamily: {
                sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
                serif: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "Roboto", "sans-serif"]
            }
        }
    }
};
