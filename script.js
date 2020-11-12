const coSto = {};

coSto.preTaxTotal = 0;

coSto.itemsInCart = 0;
coSto.totalItemPrice = 0;

// array items represent: 
//      supply, 
//      price
// change the arrays to objs to their properties can be called by their names instead of array locations TODO
coSto.inventory = {
    mask: [
        100,
        10
    ],
    tp: [
        500,
        8
    ],
    sani: [
        1000,
        3
    ]
};

coSto.cart = {};

coSto.updateNavDisplay = function() {
    // update the individual inventory in NAV
    coSto.spanToChange = `span.${coSto.itemName}`;
    console.log(`coSto.spanToChange is`, coSto.spanToChange);
    $(coSto.spanToChange).text(`${coSto.newInventoryNumber}`);
    // update the current-cart-total-items in NAV
    $('.current-cart-total-items').text(coSto.itemsInCart);
    // update the current-cart-total-cost in NAV TODO
}

coSto.itemAdder = function() {
    // ADDS TO the cart object according to quantity (only good for 'Add to cart' & '+' -- not 'quantity field')
    if (coSto.cart[coSto.itemName]) {
        coSto.cart[coSto.itemName] += 1;
    } else {
        coSto.cart[coSto.itemName] = 1;
    }
    // change the inventory object according to quantity (only good for 'Add to cart' & '+', not 'quantity field')
    coSto.inventory[coSto.itemName][0] -= 1;
    coSto.newInventoryNumber = coSto.inventory[coSto.itemName][0];
    // log the new inventory
    console.log(coSto.newInventoryNumber);

    // update the items In Cart Variable (ONLY ADDS, not QUANT)
    coSto.itemsInCart += 1;

    coSto.updateNavDisplay();
}

coSto.itemSubber = function () {
    // subtract 1 from cart
    coSto.cart[coSto.itemName] -= 1;
    // change the inventory
    coSto.inventory[coSto.itemName][0] += 1;
    coSto.newInventoryNumber = coSto.inventory[coSto.itemName][0];
    // log the new inventory
    console.log(coSto.newInventoryNumber);

    // update the items In Cart
    coSto.itemsInCart -= 1;

    coSto.updateNavDisplay();
}

// THIS IS NOT CALLED/ IMPLEMENTED YET BY THE FORM;
// OLD (ADDITIVE) METHOD IS STILL OPERATIONAL
coSto.absoluteQuantUpdate = function(quant) {
    console.log({quant});
    // if quan-t is a non-number, change to 1
    // probably dont want this actually lol TODO
    // if (isNaN(quant) === true || quant === '') { quant = 1; };
    // console.log(`quant post if is`, quant);
    // UPDATE CART VARIABLE
    coSto.cart[coSto.itemName] = quant;
    // change the inventory
    coSto.inventory[coSto.itemName][0] = coSto.inventory[coSto.itemName][0] - quant;
    // update the items In Cart
    // CAN'T BE: coSto.itemsInCart -= 1;
    // HAS TO BE DONE IN A MORE ABSOLUTE WAY, ACTUALLY ADDING UP FROM THE coSto.cart OBJECT ITSELF VIA LOOPING TODO
}

coSto.totaler = function() {
    for (i in coSto.cart) {
        let quantity = coSto.cart[i]
        let price = coSto.inventory[i][1];
        let totalItemPrice = price * quantity;
        console.log(`i = ${i}, quantity = ${quantity}, totalItemPrice = $${totalItemPrice} (@ $${price}-per-item)`);
        // add each item's quantity-adjusted price to total before tax
        // this could also be separated into a separate function TODO
        coSto.preTaxTotal += totalItemPrice;
    }
}


coSto.addToCartListener = function() {
    $('.order-form').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.itemName = $(this).find('.add-to-cart').attr('id');
        coSto.itemAdder();
        // display the edit quantity box TODO (DONE BUT ENABLE LATER)
        // $('.edit-quantity').css("display", "flex");
        // // hide Add to Cart button
        // $('.order-form').css("display", "none");
    });
};
coSto.minusFormListener = function () {
    $('.subtract').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.itemName = $(this).attr('id');
        coSto.itemSubber();
    });
};
coSto.addFormListener = function () {
    $('.add').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.itemName = $(this).attr('id');
        coSto.itemAdder();
    });
};
coSto.quantityFieldListener = function () {
    $('.quantity-form').on('submit', function (e) {
        e.preventDefault();
        // put quantity from text field into item Qty variable TODO
        coSto.itemQty = parseInt($(this).find('#quantity').val());
        console.log(`coSto.itemQty is `, coSto.itemQty);
        coSto.itemName = $(this).find('#quantity').attr('class');
        coSto.itemAdder(coSto.itemQty);
    });
};

coSto.checkOutListener = function() {
    $('button.check-out').on('click', function (e) {
        e.preventDefault();
        console.log(`Check Out button pressed`);
        // add up all purchased items 
        for (i in coSto.cart) {
            let quantity = coSto.cart[i]
            let price = coSto.inventory[i][1];
            let totalItemPrice = price * quantity;
            console.log(`i = ${i}, quantity = ${quantity}, totalItemPrice = $${totalItemPrice} (@ $${price}-per-item)`);

            $('.cartDisplay').append(`
                <li>${quantity}</li>
                <li>${i}</li>
                <li>$${totalItemPrice}</li>
            `);
        }

        // CALCULATE AND PRINT TOTALS -- THESE SHOULD BE SEPARATED so 'current total' can be displayed in nav on the fly TODO
        console.log(coSto.preTaxTotal);
        $('.totalsSection').append(`
            <li></li>
            <li>Total: </li>
            <li>$${coSto.preTaxTotal}</li>
        `);
        // calculate total post tax
        coSto.postTaxTotal = (coSto.preTaxTotal * 1.14).toFixed(2);
        // print total post tax
        $('.totalsSection').append(`
            <li></li>
            <li>Total with tax: </li>
            <li>$${coSto.postTaxTotal}</li>
        `);
        // calculate total with shipping
        coSto.totalWithShipping = (parseFloat(coSto.postTaxTotal) + 10).toFixed(2);
        // print total with shipping
        $('.totalsSection').append(`
            <li></li>
            <li><strong>Total with shipping: </strong></li>
            <li><strong>$${coSto.totalWithShipping}</strong></li>
        `);

        // animate/navigate to checkout section
        $('.store').animate({ height: '0' }, 200);
        $('.checkout').animate({ height: '100vh' }, 200);

    });
}

coSto.editOrderListener = function () {
    $('button.edit-order').on('click', function (e) {
        e.preventDefault();

        $('.cartDisplay').empty();
        $('.totalsSection').empty();

        console.log(`Edit Order button pressed`);
        // animate/navigate back to store section
        $('.store').animate({ height: '100vh' }, 200);
        $('.checkout').animate({ height: '0' }, 200);
    });
}


coSto.init = function () {
    coSto.addToCartListener();
    coSto.minusFormListener();
    coSto.addFormListener();
    coSto.quantityFieldListener();

    coSto.checkOutListener();
    coSto.editOrderListener();
}

$(function () {
    coSto.init();
    // console.log(coSto.inventory);
});