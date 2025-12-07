const getTotalPrice = (startDate: Date, endDate: Date, price: number) => {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return totalDays * price;
}

export default getTotalPrice