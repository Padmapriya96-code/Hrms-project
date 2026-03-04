using System;

namespace HRMSAPPLICATION.DTO
{
    public class PfsettingDto
    {
        public int PnCompanyId { get; set; }
        public string EffectiveMonthFrom { get; set; }
        public int EffectiveFromYear { get; set; }
        public double PfContribution { get; set; }
        public string MaxCeiling { get; set; }
        public string PfBelowCeiling { get; set; }
        public double EpfContribution { get; set; }
        public decimal UpperLimit { get; set; }
        public double EpsContribution { get; set; }
        public decimal EligibilityAmount { get; set; }
        public double AdminCharges { get; set; }
        public string RoundingOptions { get; set; }
    }
}
