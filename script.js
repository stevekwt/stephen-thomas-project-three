const coSto = {};

coSto.preTaxTotal = 0;
coSto.postTaxTotal = 0;

coSto.itemsInCart = 0;


// array items represent: 
//      supply, 
//      price,
//      baseline supply (doesn't change, used to recalculate totals)
//      full name
// change the arrays to objs to their properties can be called by their names instead of array locations TODO
coSto.inventory = {
    mask: [
        100,
        10,
        100,
        "Face mask"
    ],
    tp: [
        500,
        8,
        500,
        "Toilet Paper Roll"
    ],
    sani: [
        1000,
        3,
        1000,
        "Hand Sanitizer"
    ]
};

coSto.cart = {};

coSto.updateNavDisplay = function() {
    // update the individual inventory in NAV
    coSto.spanToChange = `span.${coSto.selectedItemName}`;
    console.log(`coSto.spanToChange is`, coSto.spanToChange);
    $(coSto.spanToChange).text(`${coSto.newInventoryNumber}`);
    // update the current-cart-total-items in NAV
    $('.current-cart-total-items').text(coSto.itemsInCart);
    // update the current-cart-total-cost in NAV TODO
    $('.current-cart-total-cost').text(`$${coSto.preTaxTotal}`);
}

coSto.updateQuantityField = function() {
    let quantSelect = `input.${coSto.selectedItemName}`;
    $(quantSelect).val(coSto.cart[coSto.selectedItemName]);
}

coSto.itemAdder = function() {
    // ADDS TO the cart object according to quantity (only good for 'Add to cart' & '+' -- not 'quantity field')
    if (coSto.cart[coSto.selectedItemName]) {
        coSto.cart[coSto.selectedItemName] += 1;
    } else {
        coSto.cart[coSto.selectedItemName] = 1;
    }
    // change the inventory object according to quantity (only good for 'Add to cart' & '+', not 'quantity field')
    coSto.inventory[coSto.selectedItemName][0] -= 1;
    coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
    // log the new inventory
    console.log(coSto.newInventoryNumber);
}

coSto.itemSubber = function () {
    // subtract 1 from cart
    coSto.cart[coSto.selectedItemName] -= 1;
    // change the inventory
    coSto.inventory[coSto.selectedItemName][0] += 1;
    coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
    // log the new inventory
    console.log(coSto.newInventoryNumber);
}

coSto.absoluteQuantUpdate = function(quant) {
    console.log({quant});
    // if quan-t is a non-number, change to 1
    // probably dont want this actually lol TODO
    if (isNaN(quant) === false && quant !== '' && quant > 0) { 
        // CHANGE CART INFO
        coSto.cart[coSto.selectedItemName] = coSto.itemQty;
        // CHANGE INVENTORY INFO by referencing its initial value which never change (item 2 in array)
        coSto.inventory[coSto.selectedItemName][0] = coSto.inventory[coSto.selectedItemName][2] - coSto.itemQty;
        // update inventory
        coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
    } else {
        coSto.updateQuantityField();
    };
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
    coSto.totalWithShipping = "0.00";
    if (coSto.postTaxTotal > 0) {
        coSto.totalWithShipping = (parseFloat(coSto.postTaxTotal) + 10).toFixed(2);
    }

    // undo button display change if items in cart drops back below 1 
    // if (coSto.itemsInCart < 1) {
    if (coSto.cart[coSto.selectedItemName] < 1) {
        // hide quantity box
        let qtyBoxToChange = `.edit-quantity.${coSto.selectedItemName}`;
        $(qtyBoxToChange).css("display", "none");
        // re-display the 'Add to Cart' button
        let addToCartButtonToChange = `.order-form.${coSto.selectedItemName}`;
        $(addToCartButtonToChange).css("display", "block");
    }

}


coSto.addToCartListener = function() {
    $('.order-form').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.selectedItemName = $(this).find('.add-to-cart').val();
        coSto.itemAdder();
        // CALL TOTALER FUNCTION 
        coSto.totaler();
        // update nav display
        coSto.updateNavDisplay();
        // update quantity field
        coSto.updateQuantityField();

        // display quantity box
        let qtyBoxToChange = `.edit-quantity.${coSto.selectedItemName}`;
        $(qtyBoxToChange).css("display", "flex");
        // hide the 'Add to Cart' button
        let addToCartButtonToChange = `.order-form.${coSto.selectedItemName}`;
        $(addToCartButtonToChange).css("display", "none");
    });
};
coSto.minusFormListener = function () {
    $('.subtract').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.selectedItemName = $(this).val();
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
        coSto.selectedItemName = $(this).val();
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
        coSto.selectedItemName = $(this).find('#quantity').attr('class');
        coSto.absoluteQuantUpdate(coSto.itemQty);
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
            if (quantity > 0) {
                $('.cartDisplay').append(`
                    <li>${quantity}</li>
                    <li>${coSto.inventory[i][3]}</li>
                    <li>$${totalItemPrice}</li>
                `);
            }
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
        $('.store').animate({ height: '0' }, 0);
        $('.checkout').animate({ height: '100%' }, 0);


        $('body').animate({
            scrollTop: $(".checkout").offset().top
        }, 0);

    });
}

coSto.editOrderListener = function () {
    $('button.edit-order').on('click', function (e) {
        e.preventDefault();

        $('.cartDisplay').empty();
        $('.totalsSection').empty();

        console.log(`Edit Order button pressed`);
        // animate/navigate back to store section
        $('.store').animate({ height: '120%' }, 0);
        $('.checkout').animate({ height: '0' }, 0);

        $('body').animate({
            scrollTop: $(".store").offset().top
        }, 0);
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