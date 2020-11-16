const coSto = {};
coSto.preTaxTotal = 0;
coSto.postTaxTotal = 0;
coSto.itemsInCart = 0;
coSto.cart = {};
// array items represent: 
//      supply, 
//      price,
//      baseline supply (doesn't change, used to recalculate totals)
//      full name
// (I now know this data would be better represented as an array of objects! Will not repeat this structure in the future!)
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

coSto.updateNavDisplay = function() {
    // update the individual inventory in NAV
    coSto.spanToChange = `span.${coSto.selectedItemName}`;
    $(coSto.spanToChange).text(`${coSto.newInventoryNumber}`);
    // update the current-cart-total-items in NAV
    $('.current-cart-total-items').text(coSto.itemsInCart);
    // update the current-cart-total-cost in NAV 
    $('.current-cart-total-cost').text(`$${coSto.preTaxTotal}`);
}

coSto.updateQuantityField = function() {
    let quantSelect = `input.${coSto.selectedItemName}`;
    $(quantSelect).val(coSto.cart[coSto.selectedItemName]);
}

coSto.itemAdder = function() {
    // if inventory limit is already reached
    if (coSto.cart[coSto.selectedItemName] >= coSto.inventory[coSto.selectedItemName][2]) {
        alert(`Sorry, that's as many as we have!`);
    } else {
        // CHANGE VALUES...
        if (coSto.cart[coSto.selectedItemName]) {
        // if an item for this product is already in cart object, increments its value 
            coSto.cart[coSto.selectedItemName] += 1;
        } else {
            // if no such item already in cart object, creates a property with name & value 
            coSto.cart[coSto.selectedItemName] = 1;
        }
        // change the inventory value
        coSto.inventory[coSto.selectedItemName][0] -= 1;
        coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
    }
}

coSto.itemSubber = function () {
    // subtract 1 from cart
    coSto.cart[coSto.selectedItemName] -= 1;
    // change the inventory
    coSto.inventory[coSto.selectedItemName][0] += 1;
    coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
}

coSto.absoluteQuantUpdate = function(quant) {
    // error handling:
    if (quant > coSto.inventory[coSto.selectedItemName][2]) {
            // if they try to order more than we have of this item
            alert(`Sorry, that's more than we have. Try ordering fewer!`);
            coSto.updateQuantityField();
    } else if (isNaN(quant) === false && quant !== '' && quant > -1) { 
        // CHANGE CART INFO
        coSto.cart[coSto.selectedItemName] = coSto.itemQty;
        // CHANGE INVENTORY INFO by referencing its initial value which never changes
        coSto.inventory[coSto.selectedItemName][0] = coSto.inventory[coSto.selectedItemName][2] - coSto.itemQty;
        // update inventory
        coSto.newInventoryNumber = coSto.inventory[coSto.selectedItemName][0];
    } else {
        // if user hasn't inputted a positive number, the quantity input field resets to its current value
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
        coSto.totaler();
        coSto.updateNavDisplay();
        coSto.updateQuantityField();
        // CHANGE DISPLAY FROM 'ADD TO CART' BUTTON TO '[-] [1] [+]'
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
        coSto.totaler();
        coSto.updateNavDisplay();
        coSto.updateQuantityField();
    });
};
coSto.addFormListener = function () {
    $('.add').on('click', function (e) {
        e.preventDefault();
        // put button ID into item Name variable
        coSto.selectedItemName = $(this).val();
        coSto.itemAdder();
        coSto.totaler();
        coSto.updateNavDisplay();
        coSto.updateQuantityField();
    });
};
coSto.quantityFieldListener = function () {
    $('.quantity-form').on('submit', function (e) {
        e.preventDefault();
        // put quantity from text field into item Qty variable 
        coSto.itemQty = parseInt($(this).find('#quantity').val());
        coSto.selectedItemName = $(this).find('#quantity').attr('class');
        coSto.absoluteQuantUpdate(coSto.itemQty);
        coSto.totaler();
        coSto.updateNavDisplay();
    });
};

coSto.checkOutListener = function() {
    $('button.check-out').on('click', function (e) {
        e.preventDefault();
        // add up all purchased items 
        for (i in coSto.cart) {
            let quantity = coSto.cart[i]
            let price = coSto.inventory[i][1];
            let totalItemPrice = price * quantity;
            if (quantity > 0) {
                $('.cartDisplay').append(`
                    <li>${quantity}</li>
                    <li>${coSto.inventory[i][3]}</li>
                    <li>$${totalItemPrice}</li>
                `);
            }
        }
        // CHANGE TOTALS 
        coSto.totaler();
        // PRINT TOTALS 
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
});