import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'react-native';
import { User } from '../types/User.type';

interface Message {
  userId: string;
  message: string;
  sentAt: string;
}

interface AutoReplies {
  [key: string]: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get<User>('https://deliveroowebapp.azurewebsites.net/api/users/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  function normalizeKeyword(keyword: string): string {
    return keyword.toLowerCase().trim().replace(/\s+/g, '_');
  }

  const autoReplies: AutoReplies = {
    hi: 'Hello! We have a variety of delicious dishes from different restaurants. What would you like to try?',
    chào: 'Hello! We have a variety of delicious dishes from different restaurants. What would you like to try?',
    chao: 'Hello! We have a variety of delicious dishes from different restaurants. What would you like to try?',
    hello: 'Hello! What would you like to eat today? We have many exciting choices.',
    xin_chào: 'Hello! What would you like to eat today? We have many exciting choices.',
    xin_chao: 'Hello! What would you like to eat today? We have many exciting choices.',
    help: "Sure, I'm here to help! What do you need assistance with?",
    giup: "Sure, I'm here to help! What do you need assistance with?",
    giúp: "Sure, I'm here to help! What do you need assistance with?",
    bye: "Goodbye! Have a nice day!",
    goodbye: "Goodbye! Have a nice day!",
    tạm_biệt: "Goodbye! Have a nice day!",
    tam_biet: "Goodbye! Have a nice day!",
    pizza: 'We have delicious pizzas from PizzaHub, PapaPizza, and Italiano! Which one would you like to try?',
    bánh_pizza: 'We have delicious pizzas from PizzaHub, PapaPizza, and Italiano! Which one would you like to try?',
    burger: 'Our burgers are diverse from BurgerKing, BigBite, and FastFoodie. Would you like to order one?',
    bánh_mì_kẹp: 'Our burgers (sandwiches) are diverse from BurgerKing, BigBite, and FastFoodie. Would you like to order one?',
    sushi: 'Fresh and delicious sushi from SushiHub, Oishi Sushi, and TokyoTaste is ready to serve you!',
    món_sushi: 'Fresh and delicious sushi from SushiHub, Oishi Sushi, and TokyoTaste is ready to serve you!',
    pasta: 'We have pasta from Italiano, PastaHeaven, and Little Italy. Would you like to take a look?',
    mì_ý: 'We have Italian pasta from Italiano, PastaHeaven, and Little Italy. Would you like to take a look?',
    steak: 'If you want to enjoy steak, try it from SteakHouse, GrillMaster, or Beefy Delight!',
    bít_tết: 'If you want to enjoy steak, try it from SteakHouse, GrillMaster, or Beefy Delight!',
    coffee: 'CoffeeHouse, CaffeineLab, and Brew&Bean have delicious coffee you can’t miss!',
    cà_phê: 'CoffeeHouse, CaffeineLab, and Brew&Bean have delicious coffee you can’t miss!',
    dessert: 'DessertHouse, SweetTooth, and SugarRush have many tempting desserts. Would you like to try something?',
    tráng_miệng: 'DessertHouse, SweetTooth, and SugarRush have many tempting desserts. Would you like to try something?',
    combo: 'ComboBox, MealDeal, and FastPack have cost-effective and delicious combo meals for lunch!',
    drink: 'DrinkHub, RefreshZone, and CoolBreeze offer a variety of drinks, from smoothies to bubble tea!',
    đồ_uống: 'DrinkHub, RefreshZone, and CoolBreeze offer a variety of drinks, from smoothies to bubble tea!',
    ramen: 'Our ramen comes from RamenHouse, TokyoBowl, and NoodleNest and will satisfy your cravings!',
    mì_ramen: 'Our ramen comes from RamenHouse, TokyoBowl, and NoodleNest and will satisfy your cravings!',
    pho: 'We have traditional pho from Pho24, HanoiPho, and PhoSaigon, with a rich, flavorful broth!',
    phở: 'We have traditional pho from Pho24, HanoiPho, and PhoSaigon, with a rich, flavorful broth!',
    special: 'Currently, there are special holiday dishes from ComboBox, SushiHub, and DessertHouse. Would you like to try them?',
    món_đặc_biệt: 'Currently, there are special holiday dishes from ComboBox, SushiHub, and DessertHouse. Would you like to try them?',
    recommend: 'We recommend trying pizza from PizzaHub, burgers from BurgerKing, and dessert from DessertHouse for a great experience!',
    icecream: 'IceCreamLand, FrozenDelights, and Chill&Cool have a variety of delicious ice creams. Would you like to try some?',
    kem: 'IceCreamLand, FrozenDelights, and Chill&Cool have a variety of delicious ice creams. Would you like to try some?',
    tea: 'Tea from TeaTime, ChillTea, and Tea&Co. is perfect for relaxation!',
    trà: 'Tea from TeaTime, ChillTea, and Tea&Co. is perfect for relaxation!',
    salad: 'Fresh salads from GreenBowl, SaladCorner, and FreshFarm are perfect for a light meal!',
    rau_trộn: 'Fresh salads (mixed vegetables) from GreenBowl, SaladCorner, and FreshFarm are perfect for a light meal!',
    bbq: 'BBQ from GrillMaster, BBQKing, and SmokedHouse is flavorful and delicious, perfect for an evening meal!',
    nướng: 'BBQ from GrillMaster, BBQKing, and SmokedHouse is flavorful and delicious, perfect for an evening meal!',
    seafood: 'Do you like seafood? SeafoodHouse, OceanCatch, and BlueWave have many delicious dishes!',
    hải_sản: 'Do you like seafood? SeafoodHouse, OceanCatch, and BlueWave have many delicious dishes!',
    vegan: 'We have vegan dishes from GreenEats, VeganDelight, and PlantHouse. They’re nutritious and tasty!',
    chay: 'We have vegan dishes from GreenEats, VeganDelight, and PlantHouse. They’re nutritious and tasty!',
    banhmi: 'You can try Vietnamese banh mi with various fillings from Bánh Mì 24h, Bánh Mì Ba Miền, and Bánh Mì Phượng!',
    bánh_mì: 'You can try Vietnamese banh mi with various fillings from Bánh Mì 24h, Bánh Mì Ba Miền, and Bánh Mì Phượng!',
    bunbo: 'The bun bo (Vietnamese beef noodle soup) from Bún Bò Huế 1989, Bún Bò Tô Châu, and Bún Bò Gốc Huế is full of flavor!',
    bún_bò: 'The bun bo (Vietnamese beef noodle soup) from Bún Bò Huế 1989, Bún Bò Tô Châu, and Bún Bò Gốc Huế is full of flavor!',
    hủ_tiếu: 'The southern-style hủ tiếu from Hủ Tiếu Mỹ Tho, Hủ Tiếu Nam Vang, and Hủ Tiếu Sài Gòn is delicious!',
    chè: 'Delicious desserts (chè) from Chè Thái Lan, Chè Bà Ba, and Chè Đậu Xanh are sweet and refreshing!',
    bánh_ngọt: 'You can try sweet cakes from SweetCake, BakeryHouse, and SugarRush with various delicious options!',
    donut: 'Delicious donuts from DonutDelight, SweetCircle, and HappyDonut are ready for you!',
    red_velvet: 'Red Velvet cake from VelvetCake, CakeStudio, and DessertDelight is rich in flavor!',
    bánh_trà_chiều: 'Afternoon tea cakes from AfternoonTea, Sweet&Savory, and Teatime Treats are perfect for a relaxing treat!',
    trà_sữa: 'Bubble tea from TeaTime, Bobabrew, and BubbleJoy is refreshing and delicious!',
    yogurt: 'Chilled yogurt from YogurtHouse, FreshYogurt, and DairyDream is nutritious and refreshing!',
    nước_ép: 'Fresh juices from JuiceItUp, FreshSqueeze, and PureJuice are refreshing and healthy!',
    location: 'You can find us at various locations near the city center with stores like PizzaHub, BurgerKing, and CoffeeHouse!',
    mì: 'We have a variety of noodles, from Mì Vịt Quay, Mì Xào to Mì Trộn that are all delicious!',
    gà: 'Crispy fried chicken from KFC, Lotteria, and Gà Rán 5 sao is ready for you to enjoy!',
    đồ_ăn_vặt: 'We have snacks like bánh tráng trộn, nem chua rán, and xoài lắc that are perfect for you!',
    mì_quảng: 'Mì Quảng, with its rich and savory broth, is a traditional dish from Mì Quảng Bếp Tư, Mì Quảng 3 Miền, and Mì Quảng Hội An!',
    bún_đậu_mắm_tôm: 'Bún đậu mắm tôm, a Northern Vietnamese dish, is available at Bún Đậu Cô Khàn, Bún Đậu Ngõ Nhỏ, and Bún Đậu Chí Phèo!',
    bún_riêu_cua: 'Bún riêu cua – A soup made from crab, served with tofu, tomatoes, and herbs.',
    bún_thang: 'Bún thang – A soup made from chicken, shrimp, and pork bone broth, served with chicken, Vietnamese sausage, and eggs.',
    canh_bún: 'Canh bún – A soup made from crab broth, with large noodle strands and water spinach.',
    bún_mắm: 'Bún mắm – A flavorful broth made with fermented fish, served with roasted pork, seafood, and vegetables.',
    hủ_tiếu_nam_vang: 'Hủ tiếu Nam Vang – A broth made from pork bones and dried shrimp, served with hủ tiếu noodles, minced pork, and seafood.',
    bánh_canh_cua: 'Bánh canh cua – A crab-based broth, served with bánh canh noodles and crab meat.',
    bánh_canh_chả_cá: 'Bánh canh chả cá – A sweet fish-based broth served with bánh canh noodles and fish cakes.',
    bánh_canh_giò_heo: 'Bánh canh giò heo – A pork leg-based broth, served with large bánh canh noodles and tender pork.',
    bún_chả_cá: 'Bún chả cá – A fish-based broth, served with noodles and grilled or steamed fish cakes.',
    miến_lươn: 'Miến lươn – A sweet broth made from eel, served with glass noodles and crispy fried eel.',
    lẩu_mắm: 'Lẩu mắm – A rich, fermented fish broth, served with a variety of vegetables and seafood.',
    lẩu_thả: 'Lẩu thả – A dish from Phan Thiết, served with fish, noodles, vegetables, pork, and shrimp.',
    lẩu_gà_lá_é: 'Lẩu gà lá é – A chicken soup flavored with fresh leaves, served with noodles or rice.',
    cháo_lòng: 'Cháo lòng – A rice porridge made from pork intestines and blood, served with tender pork pieces.',
    súp_cua: 'Súp cua – A rich crab soup served with quail eggs and garnished with pepper and herbs.',
    bún_nước_lèo_sóc_trăng: 'Bún nước lèo Sóc Trăng – A broth made from fermented fish, served with noodles, shrimp, and snakehead fish.',
    cheeseburger: 'Cheeseburger - A classic cheeseburger with lettuce, tomato, and cheddar cheese. Available at The Burger Joint.',
    chocolate_cake: 'Chocolate Cake - A rich, moist chocolate cake topped with creamy frosting. Available at Sweet Indulgence.',
    pepperoni_pizza: 'Pepperoni Pizza - A pizza topped with pepperoni slices and mozzarella cheese. Available at The Pizza Company.',
    cheese_fries: 'Cheese Fries - Crispy fries topped with melted cheese and served with dipping sauce. Available at The Burger Joint.',
    bacon_burger: 'Bacon Burger - A burger with crispy bacon, cheddar cheese, lettuce, tomato, and BBQ sauce. Available at Shogun Burger.',
    milkshake: 'Milkshake - A creamy milkshake made with vanilla ice cream and milk. Available at The Burger Joint.',
    fruit_tart: 'Fruit Tart - A buttery tart filled with pastry cream and topped with fresh fruit. Available at Sweet Indulgence.',
    pho_bo: 'Pho Bo - A traditional Vietnamese noodle soup with beef and herbs. Available at Ming\'s Chinese Restaurant.',
    supreme_pizza: 'Supreme Pizza - A pizza loaded with pepperoni, sausage, bell peppers, onions, and olives. Available at The Pizza Company.',
    com_tam: 'Com tam - Vietnamese broken rice served with grilled pork and egg. Available at Trattoria Antonio.',
    dim_sum: 'Dim Sum - Steamed dumplings filled with shrimp, pork, and vegetables. Available at Haidilao Hot Pot.',
    kung_pao_chicken: 'Kung Pao Chicken - A spicy stir-fry dish made with chicken, peanuts, and vegetables. Available at Ming\'s Chinese Restaurant.',
    risotto_with_mushrooms: 'Risotto with Mushrooms - Creamy risotto with sautéed mushrooms and parmesan cheese. Available at Cucina Italian Restaurant.',
    hot_and_sour_soup: 'Hot and Sour Soup - A spicy and sour soup made with mushrooms, tofu, and bamboo shoots. Available at Ming\'s Chinese Restaurant.',
    ebi_tempura_roll: 'Ebi Tempura Roll - A sushi roll with crispy shrimp tempura, avocado, and spicy mayo. Available at Sushi World.',
    hawaiian_pizza: 'Hawaiian Pizza - A tropical pizza with tomato sauce, mozzarella cheese, ham, and pineapple chunks. Available at The Pizza Company.',
    classic_coke: 'Classic Coke - A refreshing cola drink with a hint of vanilla and caramel flavors. Available at all restaurants.',
    margherita_pizza: 'Margherita Pizza - A classic pizza with tomato sauce, mozzarella cheese, and fresh basil leaves. Available at Alfredo\'s Pizzeria.',
    crispy_chicken_tenders: 'Crispy Chicken Tenders - Crispy fried chicken tenders with your choice of BBQ, buffalo, or honey mustard sauce. Available at The Burger Joint.',
    classic_beef_burger: 'Classic Beef Burger - A juicy beef patty with fresh lettuce, tomatoes, onions, and cheddar cheese, served on a sesame seed bun. Available at The Burger Joint.',
    crispy_chicken_wings: 'Crispy Chicken Wings - Crispy fried chicken wings with your choice of BBQ, buffalo, or honey mustard sauce. Available at The Burger Joint.',
    spring_rolls: 'Spring Rolls - Crispy fried rolls filled with vegetables and served with a dipping sauce. Available at Ming\'s Chinese Restaurant.',
    marinara_pizza: 'Marinara Pizza - A pizza with marinara sauce, mozzarella cheese, garlic, and anchovies. Available at The Pizza Company.',
    meat_lovers_pizza: 'Meat Lover\'s Pizza - A pizza loaded with sausage, pepperoni, bacon, and ham. Available at The Pizza Company.',
    mashed_potatoes: 'Mashed Potatoes - Creamy mashed potatoes served with gravy. Available at The Burger Joint.',
    tuna_sashimi: 'Tuna Sashimi - Fresh tuna served as thin slices, often enjoyed with soy sauce and wasabi. Available at Sushi World.',
    iced_tea: 'Iced Tea - A refreshing tea drink with a hint of lemon and sweetened with sugar. Available at Starbucks.',
    bbq_bacon_burger: 'BBQ Bacon Burger - A burger with smoky BBQ sauce, bacon, and cheddar cheese. Available at The Burger Joint.',
    four_cheese_pizza: 'Four Cheese Pizza - A pizza topped with mozzarella, cheddar, parmesan, and blue cheese. Available at Alfredo\'s Pizzeria.',
    sweet_and_sour_pork: 'Sweet and Sour Pork - A popular Chinese dish with crispy pork in a tangy sweet and sour sauce. Available at Ming\'s Chinese Restaurant.',
    spicy_chicken_burger: 'Spicy Chicken Burger - Crispy, spicy chicken breast with creamy mayo, pickles, and lettuce on a soft brioche bun. Available at The Burger Joint.',
    tropical_mango_smoothie: 'Tropical Mango Smoothie - A refreshing blend of ripe mango, coconut milk, and pineapple for a tropical escape in a glass. Available at Starbucks.',
    new_york_cheesecake: 'New York Cheesecake - A creamy and tangy cheesecake with a graham cracker crust and a drizzle of raspberry sauce. Available at Sweet Indulgence.',
    california_roll: 'California Roll - A sushi roll with crab meat, avocado, and cucumber. Available at Sushi World.',
    vegetarian_pizza: 'Vegetarian Pizza - A pizza loaded with fresh vegetables like mushrooms, bell peppers, and olives. Available at The Pizza Company.',
    dragon_roll: 'Dragon Roll - A sushi roll with eel, avocado, cucumber, and a sweet eel sauce. Available at Sushi World.',
    tiramisu: 'Tiramisu - A classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream. Available at Trattoria Antonio.',
    apple_cake: 'Apple Cake - A rich, moist chocolate cake topped with creamy frosting. Available at Sweet Indulgence.',
    grilled_chicken_salad: 'Grilled Chicken Salad - Grilled chicken breast on a bed of mixed greens, cherry tomatoes, cucumbers, and balsamic vinaigrette. Available at The Burger Joint.',
    pasta_primavera: 'Pasta Primavera - A pasta dish with seasonal vegetables and a light tomato sauce. Available at Cucina Italian Restaurant.',
    spicy_tuna_roll: 'Spicy Tuna Roll - A sushi roll filled with spicy tuna, cucumber, and avocado. Available at Sushi World.',
    pancake: 'Pancake - A coffee-flavored Italian dessert with mascarpone cheese and cocoa powder. Available at Sweet Indulgence.',
    maki_roll: 'Maki Roll - Sushi rolls with various fillings, typically vegetables or fish. Available at Sushi World.',
    chocolate_brownie: 'Chocolate Brownie - A rich and fudgy chocolate brownie topped with a scoop of vanilla ice cream. Available at Sweet Indulgence.',
    bbq_chicken_pizza: 'BBQ Chicken Pizza - A pizza topped with BBQ chicken, red onions, and cilantro. Available at The Pizza Company.',
    double_bacon_cheeseburger: 'Double Bacon Cheeseburger - A double patty burger with bacon, cheddar cheese, lettuce, and pickles. Available at The Burger Joint.',
    chicken_parmesan: 'Chicken Parmesan - Breaded chicken topped with marinara sauce and melted mozzarella. Available at Cucina Italian Restaurant.',
    fried_rice: 'Fried Rice - Stir-fried rice with vegetables, eggs, and your choice of protein. Available at Ming\'s Chinese Restaurant.',
    chicken_wings: 'Chicken Wings - Crispy fried chicken wings served with dipping sauce. Available at The Burger Joint.',
    veggie_burger: 'Veggie Burger - A vegetarian burger with a plant-based patty, lettuce, tomato, and avocado. Available at The Burger Joint.',
    chicken_nugget_platter: 'Chicken Nugget Platter - Golden crispy chicken nuggets served with dipping sauces. Available at The Burger Joint.',
    lasagna: 'Lasagna - Layers of pasta, meat sauce, cheese, and béchamel sauce baked to perfection. Available at Cucina Italian Restaurant.',
    vegan_avocado_burger: 'Vegan Avocado Burger - A plant-based patty with avocado, vegan cheese, and fresh greens on a multigrain bun. Available at The Burger Joint.',
    spaghetti_carbonara: 'Spaghetti Carbonara - Spaghetti with creamy carbonara sauce, pancetta, and parmesan. Available at Cucina Italian Restaurant.',
    crispy_fried_chicken: 'Crispy Fried Chicken - A crispy fried chicken served with a side of mashed potatoes and gravy. Available at The Burger Joint.',
    classic_burger: 'Classic Burger - A classic beef burger with lettuce, tomato, and cheddar cheese. Available at The Burger Joint.',
    goi_cuon: 'Goi Cuon - Vietnamese spring rolls filled with shrimp, vermicelli noodles, and fresh herbs. Available at Ming\'s Chinese Restaurant.',
    banh_mi: 'Banh Mi - Vietnamese sandwich with grilled pork, pickled vegetables, and cilantro. Available at Trattoria Antonio.',
    southern_fried_chicken: 'Southern Fried Chicken - A southern-style fried chicken with a crispy coating. Available at The Burger Joint.',
    fried_chicken_sandwich: 'Fried Chicken Sandwich - A crispy chicken sandwich with pickles and mayo. Available at The Burger Joint.',
    burger_1: 'Our burgers are diverse from BurgerKing, BigBite, and FastFoodie. Would you like to order one?',
    burger_2: 'Enjoy our tasty burgers from BurgerKing, BigBite, and FastFoodie. What do you feel like having today?',
    bánh_mì_kẹp_1: 'Our sandwiches (bánh mì kẹp) are also a great choice! You can try them from BurgerKing, BigBite, and FastFoodie.',
    bánh_mì_kẹp_2: 'Try our delicious bánh mì kẹp (sandwiches) from BurgerKing, BigBite, and FastFoodie!',

    pizza_1: 'Craving pizza? We have varieties from PizzaHub, PapaPizza, and Italiano! Which one do you prefer?',
    pizza_2: 'For pizza lovers, we recommend PizzaHub, PapaPizza, and Italiano. Which one would you like to try?',

    sushi_1: 'Craving fresh sushi? We have SushiHub, Oishi Sushi, and TokyoTaste to satisfy your cravings!',
    sushi_2: 'Fresh sushi from SushiHub, Oishi Sushi, and TokyoTaste is ready to serve you! What would you like to try?',

    ramen_1: 'If you love ramen, try it from RamenHouse, TokyoBowl, or NoodleNest. Are you in the mood for it?',
    ramen_2: 'Our ramen from RamenHouse, TokyoBowl, and NoodleNest will warm you up! What’s your choice today?',

    steak_1: 'If you want to enjoy a juicy steak, we have SteakHouse, GrillMaster, or Beefy Delight to choose from!',
    steak_2: 'Savor a perfect steak from SteakHouse, GrillMaster, or Beefy Delight. Which one are you interested in?',

    coffee_1: 'Need a caffeine boost? We have delicious coffee from CoffeeHouse, CaffeineLab, and Brew&Bean!',
    coffee_2: 'Coffee from CoffeeHouse, CaffeineLab, and Brew&Bean is waiting for you! What’s your pick?',

    dessert_1: 'Sweet tooth? DessertHouse, SweetTooth, and SugarRush have many tempting desserts! What would you like to try?',
    dessert_2: 'Craving something sweet? Try desserts from DessertHouse, SweetTooth, and SugarRush! What sounds good to you?',

    icecream_1: 'Cold treats! IceCreamLand, FrozenDelights, and Chill&Cool have various delicious ice creams!',
    icecream_2: 'We have a variety of ice creams from IceCreamLand, FrozenDelights, and Chill&Cool. Would you like to try some?',

    drink_1: 'Quench your thirst with drinks from DrinkHub, RefreshZone, and CoolBreeze! What would you like to sip?',
    drink_2: 'DrinkHub, RefreshZone, and CoolBreeze offer many refreshing drinks, from smoothies to bubble tea. What do you want to drink?',

    pho_1: 'Enjoy traditional pho from Pho24, HanoiPho, and PhoSaigon. What kind of pho would you like?',
    pho_2: 'Rich and flavorful pho from Pho24, HanoiPho, and PhoSaigon is here for you! Which one do you want to try?',

    vegan_1: 'We have delicious vegan dishes from GreenEats, VeganDelight, and PlantHouse. Would you like to explore them?',
    vegan_2: 'Nutritious and tasty vegan dishes await you at GreenEats, VeganDelight, and PlantHouse! What’s your choice?',

    salad_1: 'Fresh salads from GreenBowl, SaladCorner, and FreshFarm are great for a light meal! Would you like one?',
    salad_2: 'Light and refreshing salads from GreenBowl, SaladCorner, and FreshFarm are perfect for a healthy meal! Try one now!',

    bbq_1: 'BBQ lovers can enjoy flavorsome dishes from GrillMaster, BBQKing, and SmokedHouse! What would you like?',
    bbq_2: 'If you’re craving BBQ, GrillMaster, BBQKing, and SmokedHouse have the best options! What sounds good?',

    seafood_1: 'Seafood from SeafoodHouse, OceanCatch, and BlueWave is always fresh and delicious! Would you like some?',
    seafood_2: 'If you love seafood, try dishes from SeafoodHouse, OceanCatch, and BlueWave! What’s your favorite?',

    bánh_mi_1: 'Try the best Vietnamese bánh mì with various fillings from Bánh Mì 24h, Bánh Mì Ba Miền, and Bánh Mì Phượng!',
    bánh_mi_2: 'Experience the authentic taste of Vietnamese bánh mì from Bánh Mì 24h, Bánh Mì Ba Miền, and Bánh Mì Phượng!',

    dim_sum_1: 'Dim sum from Haidilao Hot Pot, Ming’s Chinese Restaurant, and YumCha is perfect for sharing. Want to try?',
    dim_sum_2: 'Steamed dim sum filled with shrimp, pork, and vegetables from Haidilao Hot Pot and Ming’s Chinese Restaurant!',

    lasagna_1: 'Enjoy classic lasagna with layers of cheese and sauce from Cucina Italian Restaurant! Would you like to try it?',
    lasagna_2: 'We have hearty lasagna at Cucina Italian Restaurant, with layers of pasta and a rich meat sauce. What do you think?',

    burger_vietnamese_1: 'Craving a Vietnamese-style burger (bánh mì kẹp)? We have them at BurgerKing, BigBite, and FastFoodie!',
    burger_vietnamese_2: 'Taste the best Vietnamese bánh mì kẹp (burger) from BurgerKing, BigBite, and FastFoodie!',

    chocolate_1: 'If you’re a chocolate lover, we have chocolate cakes, brownies, and more from Sweet Indulgence, DessertDelight, and Chocolate Haven!',
    chocolate_2: 'Indulge in our rich chocolate desserts from Sweet Indulgence, DessertDelight, and Chocolate Haven! What would you like to try?',

    chocolate_cake_1: 'Chocolate Cake from Sweet Indulgence, DessertDelight, and Chocolate Haven is a must-try for chocolate lovers! What size would you like?',
    chocolate_cake_2: 'A decadent chocolate cake from Sweet Indulgence, DessertDelight, and Chocolate Haven. Perfect for any occasion. Would you like a slice?',

    chocolate_brownie_1: 'Our rich chocolate brownies are available at Sweet Indulgence, DessertDelight, and Chocolate Haven! Would you like one with a scoop of vanilla ice cream?',
    chocolate_brownie_2: 'Enjoy a fudgy chocolate brownie from Sweet Indulgence, DessertDelight, and Chocolate Haven, topped with chocolate sauce. Want to try one?',

    chocolate_mousse_1: 'For a creamy treat, try our chocolate mousse from Sweet Indulgence, DessertDelight, and Chocolate Haven! How does that sound?',
    chocolate_mousse_2: 'Chocolate mousse from Sweet Indulgence, DessertDelight, and Chocolate Haven is smooth and rich. Would you like a taste?',

    chocolate_chip_cookie_1: 'Try our warm chocolate chip cookies from CookieLove, Sweet Indulgence, and DessertDelight. Would you like to add some milk?',
    chocolate_chip_cookie_2: 'Freshly baked chocolate chip cookies from CookieLove, Sweet Indulgence, and DessertDelight are here! Would you like to try them?',

    chocolate_ice_cream_1: 'Chocolate ice cream from IceCreamLand, FrozenDelights, and Chill&Cool is a classic favorite. Would you like a scoop?',
    chocolate_ice_cream_2: 'Chill out with rich and creamy chocolate ice cream from IceCreamLand, FrozenDelights, and Chill&Cool. Would you like to add toppings?',

    hot_chocolate_1: 'Warm up with a cup of rich hot chocolate from Chocolate Haven, Sweet Indulgence, and Brew&Bean. Would you like marshmallows with it?',
    hot_chocolate_2: 'Hot chocolate from Chocolate Haven, Sweet Indulgence, and Brew&Bean is the perfect treat. Would you like whipped cream on top?',

    chocolate_fondue_1: 'Dip fruits, marshmallows, and cookies into our delicious chocolate fondue from Chocolate Haven, Sweet Indulgence, and DessertDelight!',
    chocolate_fondue_2: 'Enjoy the rich experience of chocolate fondue from Chocolate Haven, Sweet Indulgence, and DessertDelight. What would you like to dip?',

    chocolate_truffle_1: 'Luxurious chocolate truffles from Sweet Indulgence, DessertDelight, and Chocolate Haven are perfect for satisfying your sweet tooth!',
    chocolate_truffle_2: 'Treat yourself to some heavenly chocolate truffles from Sweet Indulgence, DessertDelight, and Chocolate Haven. Would you like to try them?',

    chocolate_covered_strawberries_1: 'Chocolate-covered strawberries from Chocolate Haven, Sweet Indulgence, and DessertDelight are the perfect mix of sweet and fruity. Would you like some?',
    chocolate_covered_strawberries_2: 'Savor chocolate-covered strawberries from Chocolate Haven, Sweet Indulgence, and DessertDelight. Would you like to order them?',
  };

  const getAutoReply = (userMessage: string): string | null => {
    const normalizedMessage = normalizeKeyword(userMessage);
    if (autoReplies[normalizedMessage]) {
      return autoReplies[normalizedMessage];
    }
    return null;
  };

  const sendMessage = () => {
    const currentTime = new Date().toLocaleTimeString();
    const newMessage: Message = {
      userId: user?.userName || 'Guest',
      message,
      sentAt: currentTime,
    };

    const newMessages = [...messages, newMessage];

    // const autoReply = getAutoReply(message);
    // if (autoReply) {
    //   const replyMessage: Message = {
    //     userId: 'Bot',
    //     message: autoReply,
    //     sentAt: new Date().toLocaleTimeString(),
    //   };
    //   newMessages.push(replyMessage);
    // }

    setTimeout(() => {
      const autoReplyAfterDelay = getAutoReply(message);
      if (autoReplyAfterDelay) {
        const replyMessage: Message = {
          userId: 'Bot',
          message: autoReplyAfterDelay,
          sentAt: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      }
    }, 750);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text style={styles.userUserName}>@{user.userName}</Text>
            </View>
          )}
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text>{item.userId}: {item.message}</Text>
                <Text style={styles.timestamp}>{item.sentAt}</Text>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send" onPress={sendMessage} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userUserName: {
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});

export default ChatScreen;