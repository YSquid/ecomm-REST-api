CREATE OR REPLACE FUNCTION new_cart() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        carts(user_id)
        VALUES(new.id);

           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER new_cart
     AFTER INSERT ON users
     FOR EACH ROW
     EXECUTE PROCEDURE new_cart();
