def messy_function(x, y, z):
    if x > y:
        print("X is greater than Y")
    else:
        for i in range(5):
            print(i * i)
    return x + y + z
