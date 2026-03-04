using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymAttbonu
{
    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int AttbonusId { get; set; }

    public string? CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public decimal? Fullatt { get; set; }

    public decimal? Halfatt { get; set; }

    public decimal? Oneatt { get; set; }
}
