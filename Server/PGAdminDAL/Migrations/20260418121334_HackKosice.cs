using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PGAdminDAL.Migrations
{
    /// <inheritdoc />
    public partial class HackKosice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "HackKosice");

            migrationBuilder.CreateTable(
                name: "BankInformations",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    IntegrationType = table.Column<string>(type: "text", nullable: false),
                    SupportsOAuth = table.Column<bool>(type: "boolean", nullable: false),
                    ApiBaseUrl = table.Column<string>(type: "text", nullable: false),
                    ApiVersion = table.Column<string>(type: "text", nullable: false),
                    ClientId = table.Column<string>(type: "text", nullable: true),
                    ClientSecret = table.Column<string>(type: "text", nullable: true),
                    AuthUrl = table.Column<string>(type: "text", nullable: true),
                    TokenUrl = table.Column<string>(type: "text", nullable: true),
                    AccountsEndpoint = table.Column<string>(type: "text", nullable: true),
                    TransactionsEndpoint = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankInformations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    IsRecurring = table.Column<bool>(type: "boolean", nullable: false),
                    RecurrencePeriod = table.Column<string>(type: "text", nullable: true),
                    AverageAmount = table.Column<decimal>(type: "numeric", nullable: true),
                    PaymentApiUrl = table.Column<string>(type: "text", nullable: true),
                    SupportsAutoPay = table.Column<bool>(type: "boolean", nullable: false),
                    RequiresCustomerId = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    Avatar = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastLogin = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Banks",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    BankInformationId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Banks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Banks_BankInformations_BankInformationId",
                        column: x => x.BankInformationId,
                        principalSchema: "HackKosice",
                        principalTable: "BankInformations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Banks_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "HackKosice",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Jars",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TargetAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    CurrentAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    Balance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Jars_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "HackKosice",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceInfo = table.Column<string>(type: "text", nullable: false),
                    IPAddress = table.Column<string>(type: "text", nullable: false),
                    KeyHash = table.Column<string>(type: "text", nullable: false),
                    Salt = table.Column<string>(type: "text", nullable: false),
                    LoginTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sessions_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "HackKosice",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    BankModelId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CardHolderName = table.Column<string>(type: "text", nullable: false),
                    ExpiryDate = table.Column<string>(type: "text", nullable: false),
                    Cvv = table.Column<string>(type: "text", nullable: true),
                    CardType = table.Column<string>(type: "text", nullable: false),
                    SpendingLimit = table.Column<decimal>(type: "numeric", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsBlocked = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cards_Banks_BankModelId",
                        column: x => x.BankModelId,
                        principalSchema: "HackKosice",
                        principalTable: "Banks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JarAccesses",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JarId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CanDeposit = table.Column<bool>(type: "boolean", nullable: false),
                    CanWithdraw = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JarAccesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JarAccesses_Jars_JarId",
                        column: x => x.JarId,
                        principalSchema: "HackKosice",
                        principalTable: "Jars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JarAccesses_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "HackKosice",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                schema: "HackKosice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    BankModelId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardId = table.Column<Guid>(type: "uuid", nullable: true),
                    JarId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MerchantName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Banks_BankModelId",
                        column: x => x.BankModelId,
                        principalSchema: "HackKosice",
                        principalTable: "Banks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_Cards_CardId",
                        column: x => x.CardId,
                        principalSchema: "HackKosice",
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Transactions_Jars_JarId",
                        column: x => x.JarId,
                        principalSchema: "HackKosice",
                        principalTable: "Jars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Transactions_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "HackKosice",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Banks_BankInformationId",
                schema: "HackKosice",
                table: "Banks",
                column: "BankInformationId");

            migrationBuilder.CreateIndex(
                name: "IX_Banks_UserId",
                schema: "HackKosice",
                table: "Banks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_BankModelId",
                schema: "HackKosice",
                table: "Cards",
                column: "BankModelId");

            migrationBuilder.CreateIndex(
                name: "IX_JarAccesses_JarId",
                schema: "HackKosice",
                table: "JarAccesses",
                column: "JarId");

            migrationBuilder.CreateIndex(
                name: "IX_JarAccesses_UserId",
                schema: "HackKosice",
                table: "JarAccesses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Jars_UserId",
                schema: "HackKosice",
                table: "Jars",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_UserId",
                schema: "HackKosice",
                table: "Sessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BankModelId",
                schema: "HackKosice",
                table: "Transactions",
                column: "BankModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CardId",
                schema: "HackKosice",
                table: "Transactions",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_JarId",
                schema: "HackKosice",
                table: "Transactions",
                column: "JarId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_UserId",
                schema: "HackKosice",
                table: "Transactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JarAccesses",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Services",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Sessions",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Transactions",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Cards",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Jars",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Banks",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "BankInformations",
                schema: "HackKosice");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "HackKosice");
        }
    }
}
