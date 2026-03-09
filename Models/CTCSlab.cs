namespace HRMSAPPLICATION.Models
{
    public class CTCSlab
    {
        public int CTCSlabID { get; set; }
        public decimal MinCTC { get; set; }
        public decimal MaxCTC { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public decimal? InterestRate { get; set; }
        public int PnCompanyID { get; set; }
        public int PnBranchID { get; set; }
        public string? LoanType { get; set; }
        public string? LoanID { get; set; }

    }
}
