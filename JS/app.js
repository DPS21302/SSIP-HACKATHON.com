 //Assigning DOM elements to variables
const form = document.getElementById('form');
const V_no = document.getElementById('V_no');
const F_name = document.getElementById('F_name');
const L_name = document.getElementById('L_name');
const M_N = document.getElementById('M_N');
const Ad = document.getElementById('Ad');
const email = document.getElementById('email');
const Pc = document.getElementById('Pc');
const R_b = document.getElementById('R_b');
const AMOUNT = document.getElementById('AMOUNT');
const C_I_D = document.getElementById('C_I_D');
const Hn = document.getElementById('Hn');


const container = document.querySelector('.container');
const animateCircles = document.querySelector('.animate-circles');

//Listen for for submission
form.addEventListener('submit', (e) => {  
//prevent default loading when form is submitted
    e.preventDefault();

  // Get values of form fields and assign to new variables
  const V_novalue = V_no.value;
const F_namevalue = F_name.value;
const L_namevalue = L_name.value;
const Advalue =     Ad.value;
const M_Nvalue =    M_N.value;
const emailvalue =  email.value;
const AMOUNTvalue = AMOUNT.value;
const Pcvalue =     Pc.value;
const R_bvalue =    R_b.value;
const C_I_Dvalue =  C_I_D.value;
const Hnvalue =  Hn.value;


  
  //conditional statements to check if form value is valid ..... If form value is not valid an error function is triggered but if it is valid a success function is triggered

    if (V_novalue === '') {
        errorMessage(V_no, "Vehicle_no is empty");
    } else {
        successMessage(V_no);
    }
    
    if (Hnvalue === '') {
        errorMessage(Hn, "Address 1 is empty");
    } else {
        successMessage(Hn);
    }
   

    if (F_namevalue === '') {
        errorMessage(F_name, " First Name is empty");
    } 
    else {
        successMessage(F_name);
    }

    if (L_namevalue=== '') {
        errorMessage(L_name, "Last Name is empty");
    } else {
        successMessage(L_name);
    }


    if (Advalue=== '') {
        errorMessage(Ad, "Address 2  is empty");
    } else {
        successMessage(Ad);
    }
    if (AMOUNTvalue=== '') {
        errorMessage(AMOUNT, "Amount is empty");
    } else {
        successMessage(AMOUNT);
    }
    if (Pcvalue=== '') {
        errorMessage(Pc, " Pin code is empty");
    } else {
        successMessage(Pc);
    }
    if (emailvalue=== '') {
        errorMessage(email, " email is empty");
    } else {
        successMessage(email);
    }
    if ( M_Nvalue=== '') {
        errorMessage(M_N, " Pin code is empty");
    } else {
        successMessage(M_N);
    }
    if ( C_I_Dvalue=== '') {
        errorMessage(C_I_D, " Date  is empty");
    } else {
        successMessage(C_I_D);
    }
    if (R_bvalue === '' || R_bvalue==="abc") {
        errorMessage(R_b, "RuleBreak is empty");
    } else {
        successMessage(R_b);
    }
   

  
// conditional statement to check if all values are valid so the bubbles can appear
    if (V_no.parentElement.classList.contains('success') && email.parentElement.classList.contains('success') 
    && AMOUNT.parentElement.classList.contains('success') && C_I_D.parentElement.classList.contains('success')
      && Ad.parentElement.classList.contains('success') && F_name.parentElement.classList.contains('success')
      && L_name.parentElement.classList.contains('success')  && R_b.parentElement.classList.contains('success')
      && M_N.parentElement.classList.contains('success') 
      &&Hn.parentElement.classList.contains('success'))
     {
        container.classList.add('complete');
        animateCircles.classList.add('complete');

    }
});


// function to be triggered if form valu is not valid. This function simply adds the error CSS class and removes that of success if it exists

function errorMessage(value, message) {
    const formControl = value.parentElement;

    if (formControl.classList.contains('success')) {
        formControl.classList.remove('success');
        formControl.classList.add('error');
    } else {
        formControl.classList.add('error');
    }
    formControl.querySelector('.errorMessage').textContent = message;


}

// function to be triggered if form valu is valid. This function simply adds the success CSS class and removes that of error if it exists

function successMessage(value) {
    const formControl = value.parentElement;

    if (formControl.classList.contains('error')) {
        formControl.classList.remove('error');
        formControl.classList.add('success');
    } else {
        formControl.classList.add('success');
    }
}

//This is a simple function to validate the email 

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}