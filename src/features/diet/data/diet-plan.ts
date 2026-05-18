import type {
  DietDaySeed,
  DietMealSeed,
  GrocerySeed,
  MealTag,
  MealTypeValue
} from "../types/diet";
import { MEAL_TYPE_LABELS } from "../utils/meal-format";

const tagKeywords: Array<{ keywords: string[]; tags: MealTag[] }> = [
  {
    keywords: [
      "paneer",
      "tofu",
      "soya",
      "whey",
      "greek yogurt",
      "curd",
      "yogurt",
      "dal",
      "chole",
      "rajma",
      "besan",
      "moong",
      "sprouts",
      "protein"
    ],
    tags: ["High Protein", "Muscle Gain", "Recovery"]
  },
  {
    keywords: [
      "spinach",
      "beetroot",
      "black chana",
      "dates",
      "raisins",
      "sesame",
      "jaggery",
      "amla",
      "sprouts"
    ],
    tags: ["Iron Boost", "Energy", "Hair Health"]
  },
  {
    keywords: [
      "banana",
      "oats",
      "rice",
      "quinoa",
      "poha",
      "upma",
      "potatoes",
      "toast",
      "pulao",
      "khichdi"
    ],
    tags: ["Energy", "Clean Bulk"]
  },
  {
    keywords: [
      "chia",
      "flax",
      "pumpkin",
      "walnuts",
      "almonds",
      "nuts",
      "makhana",
      "peanut butter"
    ],
    tags: ["Skin Glow", "Hair Health", "Clean Bulk"]
  },
  {
    keywords: ["lemon", "orange", "fruit", "fruits", "amla", "salad", "carrot"],
    tags: ["Skin Glow", "Iron Boost", "Recovery"]
  }
];

const ingredientLookup: Record<string, string[]> = {
  "Oats cooked in milk": ["oats", "milk", "water", "cinnamon", "jaggery or honey"],
  Banana: ["banana"],
  "Peanut butter": ["peanut butter"],
  "Chia/flax seeds": ["chia seeds", "flax seeds"],
  "Almonds & raisins": ["almonds", "raisins"],
  "Coconut water": ["coconut water"],
  "Roasted black chana": ["black chickpeas", "salt", "chaat masala"],
  "Paneer bhurji": ["paneer", "onion", "tomato", "green chilli", "turmeric", "cumin", "coriander"],
  Dal: ["lentils", "turmeric", "cumin", "garlic", "ghee", "coriander"],
  Rice: ["rice", "water", "salt"],
  "Salad + lemon": ["cucumber", "carrot", "onion", "tomato", "lemon"],
  Curd: ["curd"],
  "Banana + black coffee": ["banana", "black coffee"],
  "Whey protein + banana": ["whey protein", "banana", "water or milk"],
  "Soya chunks pulao": ["soya chunks", "rice", "peas", "carrot", "spices"],
  Roti: ["whole wheat flour", "water", "salt"],
  "Mixed veg": ["mixed vegetables", "turmeric", "cumin", "ginger", "coriander"],
  "Tofu curry": ["tofu", "onion", "tomato", "ginger", "garlic", "spices"],
  "Turmeric milk": ["milk", "turmeric", "black pepper"],
  "Besan chilla stuffed with paneer": ["besan", "paneer", "onion", "coriander", "spices"],
  "Mint chutney": ["mint", "coriander", "lemon", "green chilli"],
  "Fruit bowl": ["seasonal fruits", "banana", "apple", "pomegranate"],
  "Dates + walnuts": ["dates", "walnuts"],
  "Rajma rice": ["kidney beans", "rice", "onion", "tomato", "spices"],
  "Beetroot salad": ["beetroot", "carrot", "lemon", "salt"],
  "Dates + peanuts": ["dates", "peanuts"],
  "Greek yogurt + honey + fruits": ["greek yogurt", "honey", "seasonal fruits"],
  "Quinoa pulao": ["quinoa", "mixed vegetables", "spices"],
  "Dal makhani": ["whole black lentils", "kidney beans", "tomato", "cream", "spices"],
  Salad: ["cucumber", "carrot", "tomato", "lemon"],
  Smoothie: ["milk", "oats", "banana", "peanut butter", "cocoa", "whey optional"],
  "Amla juice": ["amla", "water", "lemon"],
  "Roasted makhana": ["makhana", "ghee", "salt", "pepper"],
  Chole: ["chickpeas", "onion", "tomato", "ginger", "spices"],
  "Paneer salad": ["paneer", "cucumber", "tomato", "lettuce", "lemon"],
  "Banana + raisins": ["banana", "raisins"],
  "Paneer sandwich": ["paneer", "whole wheat bread", "mint chutney", "vegetables"],
  "Tofu stir fry": ["tofu", "bell peppers", "beans", "soy sauce", "ginger"],
  "Spinach soup": ["spinach", "garlic", "black pepper", "lemon"],
  "Poha with peanuts": ["poha", "peanuts", "onion", "mustard seeds", "curry leaves"],
  "Sprouts salad": ["sprouts", "onion", "tomato", "lemon", "coriander"],
  "Orange juice": ["oranges"],
  "Mixed nuts": ["almonds", "walnuts", "cashews", "raisins"],
  "Soya chunk curry": ["soya chunks", "onion", "tomato", "spices"],
  "Black coffee + banana": ["black coffee", "banana"],
  "Whey + dates": ["whey protein", "dates", "water or milk"],
  "Paneer tikka": ["paneer", "hung curd", "bell pepper", "spices"],
  Veggies: ["seasonal vegetables", "olive oil", "spices"],
  "Milk + flax seeds": ["milk", "flax seeds"],
  "Moong dal chilla": ["moong dal", "ginger", "green chilli", "coriander"],
  "Paneer filling": ["paneer", "spices", "coriander"],
  Fruit: ["seasonal fruit"],
  "Beetroot + carrot juice": ["beetroot", "carrot", "lemon", "ginger"],
  "Jeera rice": ["rice", "cumin", "ghee"],
  "Tofu sabzi": ["tofu", "seasonal vegetables", "spices"],
  "Banana + peanut butter": ["banana", "peanut butter"],
  "Soya chunks + potatoes": ["soya chunks", "potatoes", "spices"],
  Khichdi: ["rice", "moong dal", "ghee", "turmeric"],
  "Spinach salad": ["spinach", "cucumber", "lemon", "sesame seeds"],
  Yogurt: ["yogurt"],
  "Walnuts + milk": ["walnuts", "milk"],
  "Upma with veggies": ["semolina", "mixed vegetables", "mustard seeds", "curry leaves"],
  "Greek yogurt": ["greek yogurt"],
  "Dry fruits": ["almonds", "raisins", "dates"],
  "Dates + pumpkin seeds": ["dates", "pumpkin seeds"],
  "Brown rice": ["brown rice", "water", "salt"],
  "Salad with lemon": ["cucumber", "carrot", "tomato", "lemon"],
  "Raisins + coffee": ["raisins", "black coffee"],
  "Protein smoothie": ["milk", "banana", "whey protein", "oats", "peanut butter"],
  "Paneer curry": ["paneer", "onion", "tomato", "spices"],
  "Broccoli/beans": ["broccoli", "beans", "garlic", "olive oil"],
  "Curd + chia seeds": ["curd", "chia seeds"],
  "Peanut butter banana toast": ["whole wheat bread", "peanut butter", "banana"],
  "Fruits": ["seasonal fruits"],
  "Sprouts chaat": ["sprouts", "onion", "tomato", "lemon", "chaat masala"],
  Rajma: ["kidney beans", "onion", "tomato", "spices"],
  "Banana + dates": ["banana", "dates"],
  "Whey + oats shake": ["whey protein", "oats", "milk", "banana"],
  "Tofu/paneer wrap": ["tofu or paneer", "whole wheat wrap", "vegetables", "mint chutney"],
  "Veg soup": ["mixed vegetables", "ginger", "black pepper"],
  "Warm milk": ["milk"]
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function tagsFor(name: string, extraTags: MealTag[] = []): MealTag[] {
  const lowerName = name.toLowerCase();
  const tags = tagKeywords.flatMap((entry) =>
    entry.keywords.some((keyword) => lowerName.includes(keyword)) ? entry.tags : []
  );

  if (tags.length === 0) {
    tags.push("Energy", "Recovery");
  }

  return unique([...tags, ...extraTags]);
}

function benefitsFor(name: string, tags: MealTag[]): string[] {
  const lowerName = name.toLowerCase();
  const benefits: string[] = [];

  if (tags.includes("High Protein")) {
    benefits.push(
      "Supports muscle repair, strength gains, and recovery after gym training."
    );
  }
  if (tags.includes("Iron Boost")) {
    benefits.push(
      "Adds iron-supportive nutrients that help stamina, blood health, and hair strength."
    );
  }
  if (tags.includes("Energy")) {
    benefits.push(
      "Provides useful carbohydrates and micronutrients for workout energy and daily activity."
    );
  }
  if (tags.includes("Skin Glow")) {
    benefits.push(
      "Contributes antioxidants, hydration, or healthy fats that support clearer skin."
    );
  }
  if (tags.includes("Hair Health")) {
    benefits.push(
      "Helps supply minerals and good fats associated with stronger, healthier hair."
    );
  }
  if (tags.includes("Clean Bulk")) {
    benefits.push(
      "Adds quality calories for clean weight gain without relying on junk dirty bulking."
    );
  }
  if (lowerName.includes("lemon") || lowerName.includes("amla") || lowerName.includes("orange")) {
    benefits.push(
      "Vitamin C helps improve absorption from iron-rich vegetarian foods."
    );
  }

  return unique(benefits);
}

function recipeFor(name: string, ingredients: string[], mealType: MealTypeValue): string[] {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("coffee")) {
    return [
      "Brew black coffee without milk or with very little sweetener.",
      "Pair it with the fruit or dry fruit listed in the plan.",
      "Have it 30-45 minutes before training for a light energy lift."
    ];
  }

  if (lowerName.includes("juice")) {
    return [
      "Wash and prep the listed ingredients.",
      "Blend or juice with a little water, then strain only if preferred.",
      "Serve fresh so vitamin C and antioxidants are retained."
    ];
  }

  if (lowerName.includes("smoothie") || lowerName.includes("shake")) {
    return [
      "Add the ingredients to a blender with chilled milk or water.",
      "Blend until creamy and adjust thickness with more liquid if needed.",
      "Drink fresh around training or breakfast for quick nutrition."
    ];
  }

  if (
    lowerName.includes("curry") ||
    lowerName.includes("bhurji") ||
    lowerName.includes("sabzi") ||
    lowerName.includes("stir fry") ||
    lowerName.includes("mixed veg") ||
    lowerName.includes("veggies")
  ) {
    return [
      "Heat a small amount of oil or ghee and cook aromatics with spices.",
      `Add ${ingredients.slice(0, 3).join(", ")} and cook until tender.`,
      "Finish with coriander or lemon and serve warm with the planned carb."
    ];
  }

  if (
    lowerName.includes("rice") ||
    lowerName.includes("pulao") ||
    lowerName.includes("khichdi") ||
    lowerName.includes("quinoa")
  ) {
    return [
      "Rinse the grains well and soak legumes first when needed.",
      "Cook with measured water, salt, and mild spices until soft.",
      "Pair with curd or salad from the same meal for digestion and micronutrients."
    ];
  }

  if (
    lowerName.includes("chilla") ||
    lowerName.includes("toast") ||
    lowerName.includes("sandwich") ||
    lowerName.includes("wrap")
  ) {
    return [
      "Prepare the base and keep the filling ready.",
      "Cook or toast until firm and lightly crisp.",
      "Serve with chutney or vegetables from the plan."
    ];
  }

  if (lowerName.includes("salad") || lowerName.includes("chaat") || lowerName.includes("fruit")) {
    return [
      "Wash and chop all fresh ingredients.",
      "Toss with lemon, herbs, and light seasoning.",
      "Serve immediately for crunch, vitamin C, and hydration."
    ];
  }

  if (
    mealType === "BEFORE_SLEEP" ||
    lowerName.includes("milk") ||
    lowerName.includes("curd") ||
    lowerName.includes("yogurt")
  ) {
    return [
      "Use fresh dairy or a suitable vegetarian alternative.",
      "Stir in the listed seeds, spices, honey, or nuts if included.",
      "Have it calmly near bedtime to support recovery and routine."
    ];
  }

  return [
    "Prep the listed ingredients and keep the portion aligned with the day plan.",
    "Cook, mix, or assemble simply using minimal oil and home-style spices.",
    "Serve fresh with the other items in the same meal window."
  ];
}

function meal(
  mealType: MealTypeValue,
  name: string,
  options: {
    description?: string;
    ingredients?: string[];
    extraTags?: MealTag[];
  } = {}
): DietMealSeed {
  const ingredients = options.ingredients ?? ingredientLookup[name] ?? [name.toLowerCase()];
  const tags = tagsFor(name, options.extraTags);

  return {
    mealType,
    name,
    description: options.description,
    ingredients,
    recipeSteps: recipeFor(name, ingredients, mealType),
    benefits: benefitsFor(name, tags),
    tags
  };
}

export const DIET_PLAN: DietDaySeed[] = [
  {
    dayNumber: 1,
    title: "Pure Veg Gym Diet - Day 1",
    meals: [
      meal("BREAKFAST", "Oats cooked in milk"),
      meal("BREAKFAST", "Banana"),
      meal("BREAKFAST", "Peanut butter"),
      meal("BREAKFAST", "Chia/flax seeds"),
      meal("BREAKFAST", "Almonds & raisins"),
      meal("MID_MORNING", "Coconut water"),
      meal("MID_MORNING", "Roasted black chana"),
      meal("LUNCH", "Paneer bhurji"),
      meal("LUNCH", "Dal"),
      meal("LUNCH", "Rice"),
      meal("LUNCH", "Salad + lemon"),
      meal("LUNCH", "Curd"),
      meal("PRE_WORKOUT", "Banana + black coffee"),
      meal("POST_WORKOUT", "Whey protein + banana", {
        description: "Post-workout option 1 from the plan."
      }),
      meal("POST_WORKOUT", "Soya chunks pulao", {
        description: "Post-workout option 2 from the plan."
      }),
      meal("DINNER", "Roti"),
      meal("DINNER", "Mixed veg"),
      meal("DINNER", "Tofu curry"),
      meal("BEFORE_SLEEP", "Turmeric milk")
    ]
  },
  {
    dayNumber: 2,
    title: "Pure Veg Gym Diet - Day 2",
    meals: [
      meal("BREAKFAST", "Besan chilla stuffed with paneer"),
      meal("BREAKFAST", "Mint chutney"),
      meal("BREAKFAST", "Fruit bowl"),
      meal("MID_MORNING", "Dates + walnuts"),
      meal("LUNCH", "Rajma rice"),
      meal("LUNCH", "Beetroot salad"),
      meal("LUNCH", "Curd"),
      meal("PRE_WORKOUT", "Dates + peanuts"),
      meal("POST_WORKOUT", "Greek yogurt + honey + fruits"),
      meal("DINNER", "Quinoa pulao"),
      meal("DINNER", "Dal makhani"),
      meal("DINNER", "Salad"),
      meal("BEFORE_SLEEP", "Pumpkin seeds + milk", {
        ingredients: ["pumpkin seeds", "milk"]
      })
    ]
  },
  {
    dayNumber: 3,
    title: "Pure Veg Gym Diet - Day 3",
    meals: [
      meal("BREAKFAST", "Smoothie", {
        description: "Smoothie: Milk, Oats, Banana, Peanut butter, Cocoa, Whey optional.",
        extraTags: ["High Protein", "Energy"]
      }),
      meal("MID_MORNING", "Amla juice"),
      meal("MID_MORNING", "Roasted makhana"),
      meal("LUNCH", "Chole"),
      meal("LUNCH", "Rice"),
      meal("LUNCH", "Paneer salad"),
      meal("PRE_WORKOUT", "Banana + raisins"),
      meal("POST_WORKOUT", "Paneer sandwich"),
      meal("DINNER", "Tofu stir fry"),
      meal("DINNER", "Roti"),
      meal("DINNER", "Spinach soup"),
      meal("BEFORE_SLEEP", "Curd")
    ]
  },
  {
    dayNumber: 4,
    title: "Pure Veg Gym Diet - Day 4",
    meals: [
      meal("BREAKFAST", "Poha with peanuts"),
      meal("BREAKFAST", "Sprouts salad"),
      meal("BREAKFAST", "Orange juice"),
      meal("MID_MORNING", "Mixed nuts"),
      meal("LUNCH", "Soya chunk curry"),
      meal("LUNCH", "Rice"),
      meal("LUNCH", "Salad"),
      meal("PRE_WORKOUT", "Black coffee + banana"),
      meal("POST_WORKOUT", "Whey + dates"),
      meal("DINNER", "Paneer tikka"),
      meal("DINNER", "Roti"),
      meal("DINNER", "Veggies"),
      meal("BEFORE_SLEEP", "Milk + flax seeds")
    ]
  },
  {
    dayNumber: 5,
    title: "Pure Veg Gym Diet - Day 5",
    meals: [
      meal("BREAKFAST", "Moong dal chilla"),
      meal("BREAKFAST", "Paneer filling"),
      meal("BREAKFAST", "Fruit"),
      meal("MID_MORNING", "Beetroot + carrot juice"),
      meal("LUNCH", "Dal"),
      meal("LUNCH", "Jeera rice"),
      meal("LUNCH", "Tofu sabzi"),
      meal("LUNCH", "Curd"),
      meal("PRE_WORKOUT", "Banana + peanut butter"),
      meal("POST_WORKOUT", "Soya chunks + potatoes"),
      meal("DINNER", "Khichdi"),
      meal("DINNER", "Spinach salad"),
      meal("DINNER", "Yogurt"),
      meal("BEFORE_SLEEP", "Walnuts + milk")
    ]
  },
  {
    dayNumber: 6,
    title: "Pure Veg Gym Diet - Day 6",
    meals: [
      meal("BREAKFAST", "Upma with veggies"),
      meal("BREAKFAST", "Greek yogurt"),
      meal("BREAKFAST", "Dry fruits"),
      meal("MID_MORNING", "Dates + pumpkin seeds"),
      meal("LUNCH", "Chole"),
      meal("LUNCH", "Brown rice"),
      meal("LUNCH", "Salad with lemon"),
      meal("PRE_WORKOUT", "Raisins + coffee"),
      meal("POST_WORKOUT", "Protein smoothie"),
      meal("DINNER", "Paneer curry"),
      meal("DINNER", "Roti"),
      meal("DINNER", "Broccoli/beans"),
      meal("BEFORE_SLEEP", "Curd + chia seeds")
    ]
  },
  {
    dayNumber: 7,
    title: "Pure Veg Gym Diet - Day 7",
    meals: [
      meal("BREAKFAST", "Peanut butter banana toast"),
      meal("BREAKFAST", "Protein smoothie"),
      meal("BREAKFAST", "Fruits"),
      meal("MID_MORNING", "Sprouts chaat"),
      meal("LUNCH", "Rajma"),
      meal("LUNCH", "Rice"),
      meal("LUNCH", "Beetroot salad"),
      meal("LUNCH", "Curd"),
      meal("PRE_WORKOUT", "Banana + dates"),
      meal("POST_WORKOUT", "Whey + oats shake"),
      meal("DINNER", "Tofu/paneer wrap"),
      meal("DINNER", "Veg soup"),
      meal("BEFORE_SLEEP", "Warm milk")
    ]
  }
];

function g(
  dayNumber: number,
  name: string,
  quantity: string,
  mealType: MealTypeValue,
  relatedDish: string
): GrocerySeed {
  return {
    dayNumber,
    name,
    quantity,
    relatedMeal: MEAL_TYPE_LABELS[mealType],
    relatedDish
  };
}

export const GROCERY_PLAN: GrocerySeed[] = [
  g(1, "Oats", "60 g", "BREAKFAST", "Oats cooked in milk"),
  g(1, "Milk", "500 ml", "BREAKFAST", "Oats cooked in milk"),
  g(1, "Banana", "3 medium", "BREAKFAST", "Banana"),
  g(1, "Peanut butter", "2 tbsp", "BREAKFAST", "Peanut butter"),
  g(1, "Chia/flax seeds", "1 tbsp", "BREAKFAST", "Chia/flax seeds"),
  g(1, "Almonds", "8-10", "BREAKFAST", "Almonds & raisins"),
  g(1, "Raisins", "1 tbsp", "BREAKFAST", "Almonds & raisins"),
  g(1, "Coconut water", "1 glass", "MID_MORNING", "Coconut water"),
  g(1, "Roasted black chana", "1 bowl", "MID_MORNING", "Roasted black chana"),
  g(1, "Paneer", "150 g", "LUNCH", "Paneer bhurji"),
  g(1, "Dal", "1 cup cooked", "LUNCH", "Dal"),
  g(1, "Rice", "1.5 cups cooked", "LUNCH", "Rice"),
  g(1, "Salad vegetables", "1 bowl", "LUNCH", "Salad + lemon"),
  g(1, "Lemon", "1", "LUNCH", "Salad + lemon"),
  g(1, "Curd", "1 cup", "LUNCH", "Curd"),
  g(1, "Black coffee", "1 cup", "PRE_WORKOUT", "Banana + black coffee"),
  g(1, "Whey protein", "1 scoop", "POST_WORKOUT", "Whey protein + banana"),
  g(1, "Soya chunks", "50 g dry", "POST_WORKOUT", "Soya chunks pulao"),
  g(1, "Roti ingredients / wheat flour", "2-3 rotis", "DINNER", "Roti"),
  g(1, "Mixed vegetables", "1.5 cups", "DINNER", "Mixed veg"),
  g(1, "Tofu", "150 g", "DINNER", "Tofu curry"),
  g(1, "Turmeric milk ingredients", "milk + turmeric + black pepper", "BEFORE_SLEEP", "Turmeric milk"),

  g(2, "Besan", "70 g", "BREAKFAST", "Besan chilla stuffed with paneer"),
  g(2, "Paneer", "120 g", "BREAKFAST", "Besan chilla stuffed with paneer"),
  g(2, "Mint chutney ingredients", "mint + coriander + lemon", "BREAKFAST", "Mint chutney"),
  g(2, "Fruit bowl fruits", "1 bowl", "BREAKFAST", "Fruit bowl"),
  g(2, "Dates", "5-6", "MID_MORNING", "Dates + walnuts"),
  g(2, "Walnuts", "4-5 halves", "MID_MORNING", "Dates + walnuts"),
  g(2, "Rajma", "1 cup cooked", "LUNCH", "Rajma rice"),
  g(2, "Rice", "1.5 cups cooked", "LUNCH", "Rajma rice"),
  g(2, "Beetroot", "1 medium", "LUNCH", "Beetroot salad"),
  g(2, "Curd", "1 cup", "LUNCH", "Curd"),
  g(2, "Peanuts", "1 handful", "PRE_WORKOUT", "Dates + peanuts"),
  g(2, "Greek yogurt", "1 cup", "POST_WORKOUT", "Greek yogurt + honey + fruits"),
  g(2, "Honey", "1 tsp", "POST_WORKOUT", "Greek yogurt + honey + fruits"),
  g(2, "Fruits", "1 bowl", "POST_WORKOUT", "Greek yogurt + honey + fruits"),
  g(2, "Quinoa", "70 g dry", "DINNER", "Quinoa pulao"),
  g(2, "Dal makhani ingredients", "black lentils + rajma", "DINNER", "Dal makhani"),
  g(2, "Salad vegetables", "1 bowl", "DINNER", "Salad"),
  g(2, "Pumpkin seeds", "1 tbsp", "BEFORE_SLEEP", "Pumpkin seeds + milk"),
  g(2, "Milk", "1 glass", "BEFORE_SLEEP", "Pumpkin seeds + milk"),

  g(3, "Milk", "300 ml", "BREAKFAST", "Smoothie"),
  g(3, "Oats", "50 g", "BREAKFAST", "Smoothie"),
  g(3, "Banana", "2 medium", "BREAKFAST", "Smoothie"),
  g(3, "Peanut butter", "1 tbsp", "BREAKFAST", "Smoothie"),
  g(3, "Cocoa", "1 tsp", "BREAKFAST", "Smoothie"),
  g(3, "Whey optional", "1 scoop optional", "BREAKFAST", "Smoothie"),
  g(3, "Amla", "2 pieces or 30 ml juice", "MID_MORNING", "Amla juice"),
  g(3, "Roasted makhana", "1 bowl", "MID_MORNING", "Roasted makhana"),
  g(3, "Chickpeas", "1 cup cooked", "LUNCH", "Chole"),
  g(3, "Rice", "1.5 cups cooked", "LUNCH", "Rice"),
  g(3, "Paneer", "120 g", "LUNCH", "Paneer salad"),
  g(3, "Salad vegetables", "1 bowl", "LUNCH", "Paneer salad"),
  g(3, "Raisins", "1 tbsp", "PRE_WORKOUT", "Banana + raisins"),
  g(3, "Whole wheat bread", "2 slices", "POST_WORKOUT", "Paneer sandwich"),
  g(3, "Tofu", "150 g", "DINNER", "Tofu stir fry"),
  g(3, "Roti ingredients / wheat flour", "2-3 rotis", "DINNER", "Roti"),
  g(3, "Spinach", "1 bunch", "DINNER", "Spinach soup"),
  g(3, "Curd", "1 cup", "BEFORE_SLEEP", "Curd"),

  g(4, "Poha", "70 g", "BREAKFAST", "Poha with peanuts"),
  g(4, "Peanuts", "2 tbsp", "BREAKFAST", "Poha with peanuts"),
  g(4, "Sprouts", "1 bowl", "BREAKFAST", "Sprouts salad"),
  g(4, "Orange juice", "1 glass", "BREAKFAST", "Orange juice"),
  g(4, "Mixed nuts", "1 handful", "MID_MORNING", "Mixed nuts"),
  g(4, "Soya chunks", "60 g dry", "LUNCH", "Soya chunk curry"),
  g(4, "Rice", "1.5 cups cooked", "LUNCH", "Rice"),
  g(4, "Salad vegetables", "1 bowl", "LUNCH", "Salad"),
  g(4, "Black coffee", "1 cup", "PRE_WORKOUT", "Black coffee + banana"),
  g(4, "Banana", "1 medium", "PRE_WORKOUT", "Black coffee + banana"),
  g(4, "Whey protein", "1 scoop", "POST_WORKOUT", "Whey + dates"),
  g(4, "Dates", "4-5", "POST_WORKOUT", "Whey + dates"),
  g(4, "Paneer", "180 g", "DINNER", "Paneer tikka"),
  g(4, "Roti ingredients / wheat flour", "2-3 rotis", "DINNER", "Roti"),
  g(4, "Veggies", "1.5 cups", "DINNER", "Veggies"),
  g(4, "Milk", "1 glass", "BEFORE_SLEEP", "Milk + flax seeds"),
  g(4, "Flax seeds", "1 tbsp", "BEFORE_SLEEP", "Milk + flax seeds"),

  g(5, "Moong dal", "70 g", "BREAKFAST", "Moong dal chilla"),
  g(5, "Paneer", "120 g", "BREAKFAST", "Paneer filling"),
  g(5, "Fruit", "1 serving", "BREAKFAST", "Fruit"),
  g(5, "Beetroot", "1 medium", "MID_MORNING", "Beetroot + carrot juice"),
  g(5, "Carrot", "2 medium", "MID_MORNING", "Beetroot + carrot juice"),
  g(5, "Dal", "1 cup cooked", "LUNCH", "Dal"),
  g(5, "Rice", "1.5 cups cooked", "LUNCH", "Jeera rice"),
  g(5, "Cumin", "1 tsp", "LUNCH", "Jeera rice"),
  g(5, "Tofu", "150 g", "LUNCH", "Tofu sabzi"),
  g(5, "Curd", "1 cup", "LUNCH", "Curd"),
  g(5, "Banana", "1 medium", "PRE_WORKOUT", "Banana + peanut butter"),
  g(5, "Peanut butter", "1 tbsp", "PRE_WORKOUT", "Banana + peanut butter"),
  g(5, "Soya chunks", "60 g dry", "POST_WORKOUT", "Soya chunks + potatoes"),
  g(5, "Potatoes", "2 medium", "POST_WORKOUT", "Soya chunks + potatoes"),
  g(5, "Khichdi ingredients", "rice + moong dal", "DINNER", "Khichdi"),
  g(5, "Spinach", "1 bunch", "DINNER", "Spinach salad"),
  g(5, "Yogurt", "1 cup", "DINNER", "Yogurt"),
  g(5, "Walnuts", "4-5 halves", "BEFORE_SLEEP", "Walnuts + milk"),
  g(5, "Milk", "1 glass", "BEFORE_SLEEP", "Walnuts + milk"),

  g(6, "Upma ingredients", "semolina + vegetables", "BREAKFAST", "Upma with veggies"),
  g(6, "Greek yogurt", "1 cup", "BREAKFAST", "Greek yogurt"),
  g(6, "Dry fruits", "1 handful", "BREAKFAST", "Dry fruits"),
  g(6, "Dates", "5-6", "MID_MORNING", "Dates + pumpkin seeds"),
  g(6, "Pumpkin seeds", "1 tbsp", "MID_MORNING", "Dates + pumpkin seeds"),
  g(6, "Chickpeas", "1 cup cooked", "LUNCH", "Chole"),
  g(6, "Brown rice", "1.5 cups cooked", "LUNCH", "Brown rice"),
  g(6, "Salad vegetables", "1 bowl", "LUNCH", "Salad with lemon"),
  g(6, "Lemon", "1", "LUNCH", "Salad with lemon"),
  g(6, "Raisins", "1 tbsp", "PRE_WORKOUT", "Raisins + coffee"),
  g(6, "Coffee", "1 cup", "PRE_WORKOUT", "Raisins + coffee"),
  g(6, "Protein smoothie ingredients", "milk + banana + whey + oats", "POST_WORKOUT", "Protein smoothie"),
  g(6, "Paneer", "180 g", "DINNER", "Paneer curry"),
  g(6, "Roti ingredients / wheat flour", "2-3 rotis", "DINNER", "Roti"),
  g(6, "Broccoli/beans", "1.5 cups", "DINNER", "Broccoli/beans"),
  g(6, "Curd", "1 cup", "BEFORE_SLEEP", "Curd + chia seeds"),
  g(6, "Chia seeds", "1 tbsp", "BEFORE_SLEEP", "Curd + chia seeds"),

  g(7, "Whole wheat bread", "2 slices", "BREAKFAST", "Peanut butter banana toast"),
  g(7, "Peanut butter", "1 tbsp", "BREAKFAST", "Peanut butter banana toast"),
  g(7, "Banana", "2 medium", "BREAKFAST", "Peanut butter banana toast"),
  g(7, "Protein smoothie ingredients", "milk + banana + whey", "BREAKFAST", "Protein smoothie"),
  g(7, "Fruits", "1 bowl", "BREAKFAST", "Fruits"),
  g(7, "Sprouts", "1 bowl", "MID_MORNING", "Sprouts chaat"),
  g(7, "Rajma", "1 cup cooked", "LUNCH", "Rajma"),
  g(7, "Rice", "1.5 cups cooked", "LUNCH", "Rice"),
  g(7, "Beetroot", "1 medium", "LUNCH", "Beetroot salad"),
  g(7, "Curd", "1 cup", "LUNCH", "Curd"),
  g(7, "Dates", "4-5", "PRE_WORKOUT", "Banana + dates"),
  g(7, "Whey protein", "1 scoop", "POST_WORKOUT", "Whey + oats shake"),
  g(7, "Oats", "50 g", "POST_WORKOUT", "Whey + oats shake"),
  g(7, "Tofu/paneer", "150 g", "DINNER", "Tofu/paneer wrap"),
  g(7, "Whole wheat wrap", "1-2", "DINNER", "Tofu/paneer wrap"),
  g(7, "Veg soup vegetables", "1.5 cups", "DINNER", "Veg soup"),
  g(7, "Milk", "1 glass", "BEFORE_SLEEP", "Warm milk")
];

export const POWER_FOOD_GROUPS = [
  {
    title: "Protein + Muscle Gain Staples",
    foods: [
      "Paneer",
      "Greek Yogurt / hung curd",
      "Tofu",
      "Tempeh",
      "Soya Chunks",
      "Lentils",
      "Chickpeas",
      "Kidney Beans",
      "Quinoa",
      "Peanut Butter",
      "Almonds",
      "Pumpkin Seeds"
    ]
  },
  {
    title: "Highest Iron Veg Foods",
    foods: [
      "Spinach",
      "Beetroot",
      "Black Chickpeas",
      "Dates",
      "Raisins",
      "Sesame Seeds",
      "Jaggery",
      "Moringa"
    ],
    note:
      "Take vitamin C with iron foods for absorption: Lemon, Amla, Orange, Guava. Avoid tea/coffee immediately after iron-rich meals."
  }
];

export const GOAL_FOOD_GROUPS = [
  {
    title: "For Muscle Gain",
    foods: ["Paneer", "Tofu", "Soya Chunks", "Greek Yogurt", "Lentils"]
  },
  {
    title: "For Iron + Energy",
    foods: ["Spinach", "Beetroot", "Black Chickpeas", "Dates", "Pomegranate"]
  },
  {
    title: "For Skin & Hair",
    foods: ["Flaxseed", "Chia Seeds", "Pumpkin Seeds", "Amla", "Walnuts"]
  }
];

export const GYM_TIPS = [
  "Protein target: around 1.6-2.2g/kg bodyweight",
  "Sleep: 7.5-9 hrs",
  "Water: 3-4L daily",
  "Don't skip carbs because they fuel workouts",
  "Iron absorption improves with lemon/amla",
  "Avoid junk dirty bulking if the user wants clear skin and lean gains",
  "This style of eating can help build a strong athletic physique while keeping skin, hair, energy, and recovery good."
];

export const BENEFIT_CATEGORIES = [
  {
    title: "Protein + Muscle Gain",
    description:
      "Paneer, tofu, soya chunks, Greek yogurt, lentils, chickpeas, and rajma support muscle repair, strength progress, and a reliable vegetarian protein base."
  },
  {
    title: "Iron + Stamina",
    description:
      "Spinach, beetroot, black chickpeas, dates, raisins, and lemon-supported salads help energy, stamina, and blood health."
  },
  {
    title: "Skin Glow",
    description:
      "Amla, orange, fruits, chia, flax, walnuts, and clean hydration support antioxidant intake and healthier skin while lean bulking."
  },
  {
    title: "Hair Thickness",
    description:
      "Pumpkin seeds, walnuts, spinach, dates, raisins, and protein-rich meals help provide minerals, good fats, and amino acids for hair strength."
  },
  {
    title: "Workout Energy",
    description:
      "Banana, oats, rice, poha, upma, quinoa, potatoes, and coffee provide practical pre-workout and post-workout fuel."
  },
  {
    title: "Recovery",
    description:
      "Whey, curd, Greek yogurt, milk, turmeric milk, paneer, tofu, and balanced carbs support recovery, sleep routine, and glycogen refill."
  },
  {
    title: "Clean Bulk",
    description:
      "The plan combines calorie-dense foods like peanut butter, nuts, dairy, rice, roti, and quinoa with micronutrient-rich vegetables and fruit."
  }
];

export const IMPORTANT_INGREDIENT_BENEFITS = [
  {
    name: "Paneer",
    benefit:
      "High-protein vegetarian source that supports muscle repair, strength gains, and calorie surplus for clean weight gain."
  },
  {
    name: "Spinach",
    benefit:
      "Iron-rich leafy vegetable that supports energy, stamina, blood health, and hair strength."
  },
  {
    name: "Banana",
    benefit:
      "Fast-digesting carb source for pre-workout energy and post-workout glycogen recovery."
  },
  {
    name: "Tofu",
    benefit:
      "Lean plant protein that supports muscle gain and keeps dinner lighter while still recovery-focused."
  },
  {
    name: "Soya Chunks",
    benefit:
      "Dense vegetarian protein source that helps hit daily protein targets for gym progress."
  },
  {
    name: "Greek Yogurt / hung curd",
    benefit:
      "Protein-rich dairy with probiotics that can support digestion, recovery, and clean calories."
  },
  {
    name: "Beetroot",
    benefit:
      "Supports iron intake, blood flow, stamina, and a nutrient-rich approach to training energy."
  },
  {
    name: "Dates",
    benefit:
      "Quick energy, iron-supportive minerals, and easy calories for pre-workout fuel or clean weight gain."
  },
  {
    name: "Pumpkin Seeds",
    benefit:
      "Mineral-rich seeds that support hair health, recovery, and healthy fats."
  },
  {
    name: "Amla",
    benefit:
      "Vitamin C-rich food that supports iron absorption, skin health, and antioxidant protection."
  },
  {
    name: "Walnuts",
    benefit:
      "Healthy fats that support calorie surplus, hair health, and skin-friendly nutrition."
  },
  {
    name: "Oats",
    benefit:
      "Steady carbohydrates and fiber for breakfast energy, muscle glycogen, and clean bulk calories."
  }
];
