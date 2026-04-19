using Hash;
using Hash.Interface;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using PGAdminDAL;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Listen(IPAddress.Any, 8081, listenOptions =>
    {
        listenOptions.UseHttps("certificate.pfx", "3370");
    });
});

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetSection("Npgsql:ConnectionString").Value));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IHASH256, HASH256>();
builder.Services.AddScoped<IArgon2Hasher, Argon2Hasher>();

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
