export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "edible-gold-rose-truffle",
    title: "Art of Edible Gold: Designing The Rose Gold Truffle",
    excerpt: "Behind the scenes of Chef Lochi's signature gold-leaf application and organic rosewater baking process.",
    date: "June 24, 2026",
    image: "/cake_hero_main.png",
    content: [
      "In the world of luxury confectionery, visual storytelling is just as critical as flavor chemistry. At Cake By Lochi, our signature creation, 'The Rose Gold Truffle,' stands as a testament to this philosophy. Designed to serve as a stunning centerpiece for weddings and milestone celebrations, this cake marries classical pastry craftsmanship with structural architecture.",
      "The baking process begins with our custom-milled flour and organic, food-grade Persian rosewater. By incorporating rosewater sponge cake layers, we create a delicate botanical base that is both fragrant and light. To balance the floral notes, we pack a dense, tart wild berry compote between each tier, offering a sharp contrast to the rich white chocolate truffle frosting that encapsulates the layers.",
      "But the crowning glory of this masterpiece is the delicate application of 24-karat edible gold leaf. Applied completely by hand using static-charged natural bristles in our sanitized studio environment, the gold leaf is layered on top of hand-painted watercolor patterns. Each brush stroke is completely unique, ensuring that no two Rose Gold Truffles are ever identical. For aspiring designers, the key is patience: even the slightest draft can destroy a leaf of gold, meaning the application must be executed with absolute stillness and precision."
    ]
  },
  {
    slug: "transporting-tiered-cakes",
    title: "How to Store and Transport Tiered Cake Sculptures",
    excerpt: "Crucial professional guidance on maintaining structural stability and buttercream textures on warm days.",
    date: "May 18, 2026",
    image: "/cake_cat_celebration.png",
    content: [
      "Ask any professional cake artist about their highest-stress moment, and they will rarely say the baking or the decorating. Instead, the answer is almost always: the delivery. Transporting a multi-tiered cake sculpture over local roads—especially on warm, humid afternoons—requires strict mechanical planning and thermal protection.",
      "First, let's look at structural support. Every cake over two tiers must be supported by an internal dowel system. We place a central heavy-duty wooden or food-safe plastic dowel completely through the center of the cake, driven down into the base board. Each tier is supported by its own thin cardboard base and sits on a ring of vertical supports. This system ensures that the weight of the upper tiers rests entirely on the vertical structural columns rather than compressing the delicate cakes below.",
      "Second, thermal management is non-negotiable. Buttercream is a fat-based emulsion; once temperatures exceed 24°C (75°F), the fats begin to soften, resulting in slippage or bulging. We chill all tiered cakes for a minimum of 12 hours prior to transport, freezing the buttercream solid. During transport, vehicles must be pre-cooled, and the cake must rest on a completely flat, non-slip surface—preferably in the trunk or floorboard, never on a sloped car seat. Drive defensively, avoid sudden acceleration or sharp braking, and ensure the on-site team has a touch-up kit ready upon arrival."
    ]
  },
  {
    slug: "sugar-flowers-vs-real-blooms",
    title: "Sugar Flowers vs. Real Blooms: The Pastry Debate",
    excerpt: "Exploring the aesthetic, practical, and food-safety arguments surrounding cake floral decorations.",
    date: "April 02, 2026",
    image: "/cake_cat_dietary.png",
    content: [
      "The choice of cake toppers can spark intense debates among couples and pastry chefs alike. When designing a botanical-themed cake, the central conflict is often: should we use sugar flowers handcrafted from gum paste, or fresh natural blooms sourced from a local florist?",
      "From a safety perspective, sugar flowers are the clear winner. Many popular garden flowers—including hydrangeas, lilies, and sweet peas—are highly toxic if ingested. Even non-toxic flowers are often treated with systemic pesticides, chemical fertilizers, or insect sprays that should never come into contact with food. If you do choose natural blooms, you must source organic, food-safe flowers, and wrap every stem in florist tape or insert them into plastic vials before placing them into the cake.",
      "Aesthetically, sugar flowers offer complete structural control and longevity. Chef Lochi's sugar flowers are sculpted petal by petal from premium gum paste, dried, and dusted with edible petal dust to achieve lifelike details. Unlike natural blooms, sugar flowers will never wilt or discolor in a warm venue, and they can be preserved in a display case for years as a cherished keepsake of your celebration. While sugar flowers require a higher initial budget due to the intense handcrafting hours, their safety, customizability, and permanence make them a premium choice for high-end celebrations."
    ]
  }
];
