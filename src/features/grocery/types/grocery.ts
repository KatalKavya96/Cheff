export type GroceryScope = "today" | "tomorrow" | "day" | "week";

export type GroceryLogInput = {
  groceryItemId: string;
  date?: Date;
  completed: boolean;
};
