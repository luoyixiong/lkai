class Quota:
    def __init__(self):
        self.name = ""
        self.value = ""
        self.origin = ""
        self.objid = ""
        self.children = []

    def define(self, q_set):
        self.name = q_set.PROPID
        self.value = q_set.prop_value
        self.origin = q_set.origin
        self.objid = q_set.objid
        self.children = []

    def to_string(self):
        return {"name": self.name, "value": self.value, "origin": self.origin, "children": self.children}


if __name__ == '__main__':
    quota = Quota()
