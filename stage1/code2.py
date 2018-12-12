fib = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]
s = 'youbgdboxzmktx...(..iqr..(...(...t'
r1 = ''

for i in fib:
    if i <= len(s):
        print (i, '=', s[i-1])
        r1 += s[i-1]

print(r1)
