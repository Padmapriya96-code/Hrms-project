namespace HRMSAPPLICATION.DTO
{
    public class CTCSlabDto
    {
        public string? LoanName { get; set; }//will map loanID in the DB
        public decimal MinCTC { get; set; }
        public decimal MaxCTC { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public decimal? InterestRate { get; set; }
    }
}
