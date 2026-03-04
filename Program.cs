using HRMSAPPLICATION.Controllers;
using HRMSAPPLICATION.Models;
using Microsoft.EntityFrameworkCore;

using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;



public class Program
{
   
    private static void Main(string[] args)
    {
        var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
       
        var builder = WebApplication.CreateBuilder(args);
        // Add services to the container.
        builder.Services.AddScoped<Tokenhandler>();

        builder.Services.AddControllers(options =>
        {
            options.Filters.Add<AuthFilter>();
        });
        //builder.Services.AddDbContext<HrmsystemContext>();
        builder.Services.AddDbContext<MasterDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("MasterDb")));
        builder.Services.AddScoped<TenantDbContextFactory>();


        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "My API", Version = "v1" });
            // 1. Define the Security Scheme (How Swagger should handle the token)
            c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http, // Changed from ApiKey to Http
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                Description = "Enter your JWT token in the text input below.\r\n\r\nExample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'"
            });

            // 2. Make sure Swagger actually sends the token in requests
            c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
            {
                { 
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
            c.OperationFilter<AddHeaderOperationFilter>();
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReact", policy =>
            {
                policy
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Home/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        };


        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();
        app.UseCors(
           "AllowReact");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
       
        //app.MapControllerRoute(
        //    name: "default",
        //    pattern: "{controller=Home}/{action=Index}/{id?}");


        app.Run();
    }
}