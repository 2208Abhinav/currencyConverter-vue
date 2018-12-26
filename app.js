'use strict';

new Vue({   // Vue instance
    el: '#app',
    data: {
        currencies: {},
        amount: 0,
        from: 'EUR',
        to: 'USD',
        result: 0,
        loading: false,
    },
    mounted() { // Hook, vue's inbuilt
        // As soon as the vue instance is created ths=is mounted function is called
        this.getCurrencies();
    },
    computed: {
        formattedCurrencies() {
            return Object.values(this.currencies);  // Object.values return an array containing the
            // values that correspond to all of a given object's own enumerable string properties.
            // We are returning it as an array so that it can be used by "v-for"
        },
        calculateResult() {
            return (Number(this.amount) * this.result).toFixed(3);
        },
        disabled() {
            return Number(this.amount) === 0 || !this.amount || this.loading;
        },
    },
    methods: {
        getCurrencies() {
            const currencies = localStorage.getItem('currencies');

            if (currencies) {
                this.currencies = JSON.parse(currencies);

                return;
            }

            axios.get('https://free.currencyconverterapi.com/api/v6/currencies').then(
                response => {
                    localStorage.setItem('currencies', JSON.stringify(response.data.results));
                });
        },

        convertCurrency() {
            const key = `${this.from}_${this.to}`;
            this.loading = true;
            axios.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${key}`).
                then(
                    response => {
                        this.loading = false;
                        this.result = response.data.results[key].val;
                    })
        }
    },
    watch: {// This key watches the change in data property.
        from() {// Functions should correspond to names of data property.
            // Every time "from" changes this function will be called
            this.result = 0;
        },
        to() {
            this.result = 0;
        }
    }
});
