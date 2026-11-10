function loadProducts() {

    const container =
        document.getElementById("products");

    const message =
        document.getElementById("message");

    message.innerText = "Loading products...";

    fetch("/api/products")

        .then(response => {

            // Check HTTP status
            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " + response.status
                );

            }

            return response.json();

        })

        .then(products => {

            container.innerHTML = "";

            products.forEach(product => {

                const card =
                    document.createElement("div");

                card.className =
                    "product-card";

                card.innerHTML = `

                    <h3>${product.name}</h3>

                    <p>
                        Category:
                        ${product.category}
                    </p>

                    <p>
                        Price:
                        ₹${product.price}
                    </p>

                    <p>
                        Stock:
                        ${product.stock}
                    </p>

                `;

                container.appendChild(card);

            });

            message.innerText =
                "Products loaded successfully.";

        })

        .catch(error => {

            console.error(error);

            message.innerText =
                "Unable to load product data.";

        });

}


// =====================================
// POST Request
// =====================================

document
    .getElementById("productForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const product = {

            name:
                document
                .getElementById("name")
                .value
                .trim(),

            category:
                document
                .getElementById("category")
                .value
                .trim(),

            price:
                Number(
                    document
                    .getElementById("price")
                    .value
                ),

            stock:
                Number(
                    document
                    .getElementById("stock")
                    .value
                )

        };


        fetch("/api/products", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(product)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Request failed: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            document.getElementById("message")
                .innerText =
                data.message;

            document
                .getElementById("productForm")
                .reset();

            loadProducts();

        })

        .catch(error => {

            console.error(error);

            document.getElementById("message")
                .innerText =
                "Unable to add product.";

        });

    });


// Load products when page opens

loadProducts();