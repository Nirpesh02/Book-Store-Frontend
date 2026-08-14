export const initiateEsewaPayment = (esewaData) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

  for (const key in esewaData) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', esewaData[key]);
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
};
