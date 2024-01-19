export default {
    methods: {
        $alert(text) {
            this.$swal.fire({
                html: `<p style="font-family: 'Noto Sans KR', sans-serif; 
                font-size: var(--font-medium); margin-top: 24px">
                    ${text}
                </p>`,
                confirmButtonColor: 'var(--color-orange)',
                confirmButtonText: `<p style="font-family: 'Noto Sans KR', sans-serif;">확인</p>`
            })
        },
    },   
}