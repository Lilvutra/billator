import pyinputplus as pyip

#Fix: What about there are more than one person paying for the bill?

# Function to get personal items and calculate total cost for each person
def get_personal_items():
    num_people = pyip.inputInt('How many people have personal items on the list?: ', min=0)
    costs = {}

    for i in range(num_people):
        name = pyip.inputStr(f"What is the name of person {i+1}?: ")
        num_items = pyip.inputInt(f"How many items did {name} buy?: ", min=1)
        person_cost = 0

        for j in range(num_items):
            cost = pyip.inputFloat(f"Enter the cost of item {j+1} for {name}: ")
            person_cost += cost

        costs[name] = person_cost

    return costs

# Function to get shared items and calculate cost per person
def get_shared_items():
    num_items = pyip.inputInt('How many shared items on the list?: ', min=0)
    costs = {}

    for i in range(num_items):
        cost = pyip.inputFloat(f"Enter the cost of shared item {i+1}: ")
        num_people = pyip.inputInt(f"How many people share item {i+1}?: ", min=0)

        for j in range(num_people):
            name = pyip.inputStr(f"What is the name of person {j+1} sharing item {i+1}?: ")
            shared_cost = cost / num_people
            if name in costs:
                costs[name] += shared_cost
            else:
                costs[name] = shared_cost

    return costs

# Calculate the total bill and individual costs
personal_costs = get_personal_items()
shared_costs = get_shared_items()

individual_costs = {}

# Combine personal costs and shared costs for each person
for person, cost in personal_costs.items():
    if person in shared_costs:
        individual_costs[person] = cost + shared_costs[person]
    else:
        individual_costs[person] = cost

total_bill = sum(individual_costs.values())

print("Total bill:", total_bill)
print("Individual costs:")
for person, cost in individual_costs.items():
    print(f"{person}: {cost}")
    
    
    
    
   