create table if not exists public.profiles (
  firebase_uid text primary key,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id text primary key,
  title text not null,
  price integer not null check (price >= 0),
  location text not null,
  bedrooms integer not null check (bedrooms >= 0),
  bathrooms integer not null check (bathrooms >= 0),
  image_url text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_listings (
  firebase_uid text not null references public.profiles(firebase_uid) on delete cascade,
  listing_id text not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (firebase_uid, listing_id)
);

insert into public.listings (id, title, price, location, bedrooms, bathrooms, image_url, description)
values
  ('1', 'Modern Condo in Calgary', 425000, 'Downtown Calgary', 2, 2, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80', 'Beautiful modern condo located in the heart of Calgary.'),
  ('2', 'Family House in Edmonton', 589000, 'South Edmonton', 4, 3, 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80', 'Spacious family home with a large backyard.'),
  ('3', 'Luxury Apartment in Edmonton', 799000, 'Oliver Edmonton', 3, 2, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'Luxury apartment with skyline views in a vibrant neighborhood.'),
  ('4', 'Cozy Townhouse in Banff', 499000, 'Banff', 3, 2, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Cozy townhouse surrounded by mountains.'),
  ('5', 'Lakeview Bungalow in Sylvan Lake', 675000, 'Sylvan Lake', 4, 3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'Bright lakeview bungalow with space for family weekends and guests.'),
  ('6', 'Downtown Loft in Calgary', 720000, 'Beltline Calgary', 2, 2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'Stylish loft living close to restaurants, transit, and downtown offices.'),
  ('7', 'Suburban Home in Airdrie', 455000, 'Airdrie', 4, 3, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80', 'Comfortable suburban home with flexible living space and a quiet street.'),
  ('8', 'Mountain Retreat in Canmore', 889000, 'Canmore', 3, 3, 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80', 'A mountain retreat with warm finishes and easy access to outdoor trails.'),
  ('9', 'Riverside Condo in Medicine Hat', 349000, 'Medicine Hat', 2, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', 'Affordable riverside condo with open views and low-maintenance living.'),
  ('10', 'Executive Home in Sherwood Park', 835000, 'Sherwood Park', 5, 4, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'Executive home with generous square footage and polished modern finishes.'),
  ('11', 'Central Apartment in Lethbridge', 529000, 'Downtown Lethbridge', 2, 2, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 'Central apartment close to shops, cafes, and the city''s main amenities.'),
  ('12', 'Starter Home in Red Deer', 378000, 'Red Deer', 3, 2, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80', 'Starter home with a practical layout and room to grow into.'),
  ('13', 'Modern Duplex in Fort McMurray', 412000, 'Fort McMurray', 3, 3, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', 'Modern duplex offering a smart layout for first-time buyers or investors.'),
  ('14', 'Luxury Penthouse in Calgary', 1150000, 'Eau Claire Calgary', 3, 3, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Luxury penthouse with elevated finishes and prime inner-city access.'),
  ('15', 'Country Acreage Near Lethbridge', 698000, 'Lethbridge County', 5, 4, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', 'Acreage living with extra space, privacy, and room for hobbies or work.'),
  ('16', 'Bright Condo in Grande Prairie', 610000, 'Grande Prairie', 2, 2, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80', 'Bright condo with a modern interior and easy everyday convenience.')
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  location = excluded.location,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms,
  image_url = excluded.image_url,
  description = excluded.description;
