const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
});

const currencyFormatter = (value) => {
    if (!value) return;
    return formatter.format(value);
}

export default currencyFormatter;