using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class BasketController : BaseApiController
  {
    private readonly StoreContext _context;
    public BasketController(StoreContext context)
    {
      _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
      var basket = await RetrieveBasket();

      if (basket == null) return NotFound();
      return MapBasketToDto(basket);
    }



    [HttpPost] // api/basket?productId=1&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
      // Get the basket || create basket
      var basket = await RetrieveBasket();
      // Create Basket
      if (basket == null) basket = CreateBasket();
      // Get the product
      var product = await _context.Products.FindAsync(productId);
      if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });
      // add item
      basket.AddItem(product, quantity);

      // save changes
      var result = await _context.SaveChangesAsync() > 0;
      if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
      return BadRequest(new ProblemDetails { Title = "Problem adding item to basket" });
    }



    [HttpDelete]
    public async Task<ActionResult<object>> RemoveBasketItem(int productId, int quantity)
    {
      // Get the basket
      var basket = await RetrieveBasket();
      if (basket == null) return NotFound();
      // remove item or reduce quantity
      basket.RemoveItem(productId, quantity);

      // save changes
      var result = await _context.SaveChangesAsync() > 0;
      if (result) return Ok();
      return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
    }


    private async Task<Basket> RetrieveBasket()
    {
      return await _context.Baskets
              .Include(i => i.Items)
              .ThenInclude(p => p.Product)
              .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
    }
    private Basket CreateBasket()
    {

      var buyerId = Guid.NewGuid().ToString();
      var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
      Response.Cookies.Append("buyerId", buyerId, cookieOptions);
      var basket = new Basket { BuyerId = buyerId };
      _context.Baskets.Add(basket);
      return basket;
    }

    private ActionResult<BasketDto> MapBasketToDto(Basket basket)
    {
      return new BasketDto
      {
        Id = basket.Id,
        BuyerId = basket.BuyerId,
        Items = basket.Items.Select(i => new BasketItemDto
        {
          ProductId = i.ProductId,
          Name = i.Product.Name,
          Price = i.Product.Price,
          PictureUrl = i.Product.PictureUrl,
          Brand = i.Product.Brand,
          Type = i.Product.Type,
          Quantity = i.Quantity
        }).ToList()
      };
    }

  }
}