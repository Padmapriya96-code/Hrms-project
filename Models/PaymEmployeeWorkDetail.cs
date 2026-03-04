using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEmployeeWorkDetail
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public DateTime? JoiningDate { get; set; }

    public DateTime? OfferDate { get; set; }

    public DateTime? ProbationUpto { get; set; }

    public DateTime? ExtendedUpto { get; set; }

    public DateTime? ConfirmationDate { get; set; }

    public DateTime? RetirementDate { get; set; }

    public DateTime? ContractRenviewDate { get; set; }

    public string? VReason { get; set; }

    public virtual PaymEmployee PaymEmployee { get; set; } = null!;
}
