using PGAdminDAL.Models;
using System.ComponentModel.DataAnnotations;

public class UserModel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Role { get; set; }

    [Required]
    public string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Avatar { get; set; }

    public List<Sessions> Sessions { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public DateTime? LastLogin { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<BankModel> Banks { get; set; }
    public ICollection<Jar> Jars { get; set; }
}