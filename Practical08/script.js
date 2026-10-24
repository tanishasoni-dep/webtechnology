const form =
    document.getElementById("productForm");

const productId =
    document.getElementById("productId");

const nameInput =
    document.getElementById("name");

const categoryInput =
    document.getElementById("category");

const priceInput =
    document.getElementById("price");

const quantityInput =
    document.getElementById("quantity");

const descriptionInput =
    document.getElementById("description");

const table =
    document.getElementById("productTable");

const message =
    document.getElementById("message");

const submitButton =
    document.getElementById("submitButton");


// ============================
// READ PRODUCTS
// ============================

async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");


        if (!response.ok) {

            throw new Error(
                "Unable to load products"
            );

        }


        const products =
            await response.json();


        table.innerHTML = "";


        if (products.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7">
                        No products found.
                    </td>
                </tr>
            `;

            return;

        }


        products.forEach(product => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${product.id}</td>

                <td>
                    ${escapeHTML(product.name)}
                </td>

                <td>
                    ${escapeHTML(product.category)}
                </td>

                <td>
                    ₹${Number(
                        product.price
                    ).toFixed(2)}
                </td>

                <td>
                    ${product.quantity}
                </td>

                <td>
                    ${escapeHTML(
                        product.description || ""
                    )}
                </td>

                <td>

                    <button
                        onclick="editProduct(
                            ${product.id}
                        )">

                        Edit

                    </button>


                    <button
                        class="delete"
                        onclick="deleteProduct(
                            ${product.id}
                        )">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load products.";

    }

}


// ============================
// ADD / UPDATE
// ============================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            productId.value;


        const data = {

            name:
                nameInput.value.trim(),

            category:
                categoryInput.value.trim(),

            price:
                Number(priceInput.value),

            quantity:
                Number(quantityInput.value),

            description:
                descriptionInput.value.trim()

        };


        if (
            !data.name ||
            !data.category ||
            data.price <= 0 ||
            data.quantity < 0
        ) {

            message.textContent =
                "Please enter valid data.";

            return;

        }


        try {

            let url =
                "/api/products";

            let method =
                "POST";


            if (id) {

                url =
                    `/api/products/${id}`;

                method =
                    "PUT";

            }


            const response =
                await fetch(
                    url,
                    {

                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message
                );

            }


            message.textContent =
                result.message;


            resetForm();

            loadProducts();


        } catch (error) {

            console.error(error);

            message.textContent =
                error.message;

        }

    }
);


// ============================
// EDIT
// ============================

async function editProduct(id) {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        const products =
            await response.json();


        const product =
            products.find(
                item =>
                    item.id == id
            );


        if (!product) {

            alert(
                "Product not found."
            );

            return;

        }


        productId.value =
            product.id;

        nameInput.value =
            product.name;

        categoryInput.value =
            product.category;

        priceInput.value =
            product.price;

        quantityInput.value =
            product.quantity;

        descriptionInput.value =
            product.description || "";


        submitButton.textContent =
            "Update Product";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load product."
        );

    }

}


// ============================
// DELETE
// ============================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message
            );

        }


        message.textContent =
            result.message;


        loadProducts();


    } catch (error) {

        console.error(error);

        message.textContent =
            error.message;

    }

}


// ============================
// RESET FORM
// ============================

function resetForm() {

    form.reset();

    productId.value = "";

    submitButton.textContent =
        "Add Product";

}


// ============================
// BASIC OUTPUT ESCAPING
// ============================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================
// INITIAL LOAD
// ============================

loadProducts();