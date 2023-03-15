// See https://aka.ms/new-console-template for more information
Console.WriteLine(new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase });
Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(new { NameMarco = "John", Age = 42 }, new System.Text.Json.JsonSerializerOptions { }));
