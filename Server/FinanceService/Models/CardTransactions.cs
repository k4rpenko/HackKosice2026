namespace FinanceService.Models
{
    public class CardTransactions
    {
        public string FromCardId { get; set; }
        public string ToNumberCard { get; set; }
        public decimal Amount { get; set; }
    }
}
