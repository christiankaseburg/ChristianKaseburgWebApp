var webGlObject = (function () {
    return {
        init: function () {
            // Some random colors
            const colors = ["#0000CC", "#CC0000", "#33CC99", "#6699FF"]; // Page 329 in color book, 342 as well
            // Some random shapes
            const shapes = ["ball", "square", "triangle"]

            // Deciding how many shapes to add to the screen.
            var numShapes;
            if (window.screen.width <= 414) {
                numShapes = 18;
            } else {
                numShapes = 40;
            }
            const generatedShapes = [];

            for (let i = 0; i < numShapes; i++) {
                // Creating div, and adding a random shape class
                let shape = document.createElement("div");
                shape.classList.add(shapes[Math.floor(Math.random() * shapes.length)]);
                // Styling for color, and other attributes
                if (shape.classList.contains('ball')) {
                    shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
                } else {
                shape.style.outlineColor = colors[Math.floor(Math.random() * colors.length)];
                }
                shape.style.left = `${Math.floor(Math.random() * 100)}vw`;
                shape.style.bottom = `${Math.floor(Math.random() * 95)}vh`;
                shape.style.transform = `scale(${Math.random()})`;
                if (shape.classList.contains('triangle')) {
                    shape.style.background = colors[Math.floor(Math.random() * colors.length)];
                    shape.style.width = `${Math.random() * 3}em`;
                    shape.style.height = shape.style.width;
                } else {
                    shape.style.width = `${Math.random() * 2}em`;
                    shape.style.height = shape.style.width;
                }

                //Pushing shape into generatedShapes, and then adding shape to the div shapeContainer.
                generatedShapes.push(shape);
                document.getElementById('shapeContainer').appendChild(shape);
            }

            // Keyframes
            generatedShapes.forEach((el, i, ra) => {
                let to = {
                    x: Math.random() * (i % 2 === 0 ? -11 : 11),
                    y: Math.random() * 12
                };

                let anim = el.animate(
                    [
                        { transform: "translate(0, 0)" },
                        { transform: `translate(${to.x}rem, ${to.y}rem)` },
                        { transform: 'rotate(180deg)' }
                    ],
                    {
                        duration: (Math.random() + 1) * 2000, // random duration higher number slower, lower number fast
                        direction: "alternate",
                        fill: "both",
                        iterations: Infinity,
                        easing: "ease-in-out"
                    }
                );
            });
        }
    }
})(webGlObject || {})