using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PGAdminDAL.Models;
using PGAdminDAL.Models.Subclauses;

namespace PGAdminDAL
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public AppDbContext GetDbContext() => (AppDbContext)_configuration;


        // ================= USERS =================
        public DbSet<UserModel> Users { get; set; }
        public DbSet<Sessions> Sessions { get; set; }

        // ================= BANKING =================
        public DbSet<BankModel> Banks { get; set; }
        public DbSet<BankInformation> BankInformations { get; set; }

        // ================= CARDS =================
        public DbSet<Card> Cards { get; set; }

        // ================= TRANSACTIONS =================
        public DbSet<Transaction> Transactions { get; set; }

        // ================= JARS =================
        public DbSet<Jar> Jars { get; set; }
        public DbSet<JarAccess> JarAccesses { get; set; }

        // ================= SERVICES =================
        public DbSet<Service> Services { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("HackKosice");

            // ================= USER RELATIONS =================
            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.Banks)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.Jars)
                .WithOne(j => j.User)
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.Sessions)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ================= BANK -> BANK INFO =================
            modelBuilder.Entity<BankModel>()
                .HasOne(b => b.BankInformation)
                .WithMany()
                .HasForeignKey(b => b.BankInformationId)
                .OnDelete(DeleteBehavior.Restrict);

            // ================= BANK -> CARDS =================
            modelBuilder.Entity<BankModel>()
                .HasMany(b => b.Cards)
                .WithOne(c => c.Bank)
                .HasForeignKey(c => c.BankModelId)
                .OnDelete(DeleteBehavior.Cascade);

            // ================= BANK -> TRANSACTIONS =================
            modelBuilder.Entity<BankModel>()
                .HasMany(b => b.Transactions)
                .WithOne(t => t.Bank)
                .HasForeignKey(t => t.BankModelId)
                .OnDelete(DeleteBehavior.Cascade);

            // ================= TRANSACTIONS =================
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Card)
                .WithMany()
                .HasForeignKey(t => t.CardId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Jar)
                .WithMany()
                .HasForeignKey(t => t.JarId)
                .OnDelete(DeleteBehavior.SetNull);

            // ================= JAR ACCESS =================
            modelBuilder.Entity<JarAccess>()
                .HasOne(ja => ja.Jar)
                .WithMany(j => j.AccessList)
                .HasForeignKey(ja => ja.JarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JarAccess>()
                .HasOne(ja => ja.User)
                .WithMany()
                .HasForeignKey(ja => ja.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ================= OPTIONAL CONFIG =================

            modelBuilder.Entity<Card>()
                .Property(c => c.CardNumber)
                .HasMaxLength(32);

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Jar>()
                .Property(j => j.Balance)
                .HasPrecision(18, 2);
        }
    }
}