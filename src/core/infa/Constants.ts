type Constant = {
    [name: string]: number
}

export const Commitment: Constant = {
    FULL_TIME : 1,
    PART_TIME : 2,
    BOTH      : 3
}

export const Where: Constant = {
    IN_PERSON : 1,
    REMOTE    : 2,
    BOTH      : 3
}

export const Distance: Constant = {
    WORLDWIDE               : 1,
    NATIONWIDE              : 2,
    TWENTY_FIVE_MILES       : 25,
    FIFTY_MILES             : 50,
    ONE_HUNDRED_MILES       : 100,
    TWO_HUNDRED_FIFTY_MILES : 250
}

export const Education: Constant = {
    BELOW_HIGHSCHOOL    : 1,
    HIGHSCHOOL          : 2,
    ASSOCIATES          : 3,
    BACHELORS           : 4,
    MASTERS             : 5,
    DOCTORATE           : 6
}

export const Experience: Constant = {
    ENTRY        : 1,
    INTERMEDIATE : 2,
    EXPERIENCED  : 3,
    INTERN       : 4
}