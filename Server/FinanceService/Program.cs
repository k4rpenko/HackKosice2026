using Logger;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PGAdminDAL;
using PostgresService;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 8083, listenOptions =>
    {
        listenOptions.UseHttps("certificate.pfx", "3370");
    });
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetSection("Npgsql:ConnectionString").Value));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSingleton(typeof(IAppLogger<>), typeof(AppLogger<>));
builder.Services.AddScoped<IPostgresService, PostgresServiceImpl>();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
