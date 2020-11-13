const coSto = {};

coSto.preTaxTotal = 0;
coSto.postTaxTotal = 0;

coSto.itemsInCart = 0;


// array items represent: 
//      supply, 
//      price
// change the arrays to objs to their properties can be called by their names instead of array locations TODO
coSto.inventory = {
    mask: [
        100,
        10,
        100
    ],
    tp: [
        500,
        8,
        500
    ],
    sani: [
        1000,
        3,
        1000
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
    $('.current-cart-total-cost').text(`$${coSto.preTaxTotal}`);
}

coSto.updateQuantityField = function() {
    let quantSelect = `input.${coSto.itemName}`;
    $(quantSelect).val(coSto.cart[coSto.itemName]);
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
    // coSto.itemsInCart += 1;
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
    // coSto.itemsInCart -= 1;
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
    // resets totals so they're recounted anew each time (necessary b/c of how the quant form is able to override all previously-entered values)
    coSto.preTaxTotal = 0;
    coSto.itemsInCart = 0;
    // add up the total quantity-adjusted price of each purchased item
    for (i in coSto.cart) {
        let quantity = coSto.cart[i]
        let price = coSto.inventory[i][1];
        let totalItemPrice = price * quantity;
        console.log(`i = ${i}, quantity = ${quantity}, totalItemPrice = $${totalItemPrice} (@ $${price}-per-item)`);
        // add each item's quantity-adjusted price to total before tax
        coSto.preTaxTotal += totalItemPrice;
        // add up the total items in cart
        coSto.itemsInCart += quantity;
    }
    // calculate total post tax
    coSto.postTaxTotal = (coSto.preTaxTotal * 1.14).toFixed(2);
    // calculate total with shipping
    coSto.totalWithShipping = (parseFloat(coSto.postTaxTotal) + 10).toFixed(2);
}


coSto.addToCartListener = function() {
    $('.order-form').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.itemName = $(this).find('.add-to-cart').val();
        coSto.itemAdder();
        // CALL TOTALER FUNCTION 
        coSto.totaler();
        // update nav display
        coSto.updateNavDisplay();

        // update quantity field
        coSto.updateQuantityField();

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
        coSto.itemName = $(this).val();
        coSto.itemSubber();
        // CALL TOTALER FUNCTION TO ADD UP ALL TOTALS
        coSto.totaler();
        // update nav display
        coSto.updateNavDisplay();
        // update quantity field
        coSto.updateQuantityField();
    });
};
coSto.addFormListener = function () {
    $('.add').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.itemName = $(this).val();
        coSto.itemAdder();
        // CALL TOTALER FUNCTION TO ADD UP ALL TOTALS
        coSto.totaler();
        // update nav display
        coSto.updateNavDisplay();
        // update quantity field
        coSto.updateQuantityField();
    });
};
coSto.quantityFieldListener = function () {
    $('.quantity-form').on('submit', function (e) {
        e.preventDefault();
        // put quantity from text field into item Qty variable TODO
        coSto.itemQty = parseInt($(this).find('#quantity').val());
        console.log(`coSto.itemQty is `, coSto.itemQty);
        coSto.itemName = $(this).find('#quantity').attr('class');
        // DONT WANT ADDER -v- TODO
        // coSto.itemAdder(coSto.itemQty);
        // NEW: CHANGE CART INFO
        coSto.cart[coSto.itemName] = coSto.itemQty;
        // NEW: CHANGE INVENTORY INFO by referencing its initial value which never change (item 2 in array)
        coSto.inventory[coSto.itemName][0] = coSto.inventory[coSto.itemName][2] - coSto.itemQty;

        coSto.newInventoryNumber = coSto.inventory[coSto.itemName][0];
        // log the new inventory
        console.log(coSto.newInventoryNumber);

        // CALL TOTALER FUNCTION TO ADD UP ALL TOTALS
        coSto.totaler();
        // update nav display
        coSto.updateNavDisplay();
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

        // CALL TOTALER FUNCTION TO ADD UP ALL TOTALS
        coSto.totaler();

        // CALCULATE AND PRINT TOTALS -- THESE SHOULD BE SEPARATED so 'current total' can be displayed in nav on the fly TODO
        console.log(coSto.preTaxTotal);
        $('.totalsSection').append(`
            <li></li>
            <li>Total: </li>
            <li>$${coSto.preTaxTotal}</li>
        `);
        // print total post tax
        $('.totalsSection').append(`
            <li></li>
            <li>Total with tax: </li>
            <li>$${coSto.postTaxTotal}</li>
        `);
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