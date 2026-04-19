using PGAdminDAL.Models;
using System.ComponentModel.DataAnnotations;

public class UserModel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Role { get; set; }

    [Required]
    public string Email { get; set; }
    public string Password { get; set; }
    public string KeyHash { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Avatar { get; set; }

    public ICollection<Sessions> Sessions { get; set; } = new List<Sessions>();

    public DateTime? DateOfBirth { get; set; }
    public DateTime? LastLogin { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Guid> Family { get; set; } = new List<Guid>();

    public BankModel Bank { get; set; }
    public Guid BankId { get; set; }
    public ICollection<Jar> Jars { get; set; }

    public ICollection<Know> Know { get; set; }
}