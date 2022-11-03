const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getProduct: (req, res) => {
        // Add where p.isDeleted="false" --> fitur soft delete
        let filterCategory = req.query.category_id;
        let product_name = req.query.product_name;
        let { limit, sort, offset } = req.body;

        dbConf.query(`SELECT COUNT(idproduct) as totalProduct FROM product where isDeleted="false"`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                }

                let totalProduct = results[0].totalProduct

                if (filterCategory) {
                    if (filterCategory[1]) {

                        let resultFilter = filterCategory.map((val, idx) => {
                            if (idx == 0) {
                                return `(category_id = ${val}`
                            } else if (idx == (filterCategory.length - 1)) {
                                if (JSON.stringify(product_name) == '{}') {
                                    return `or category_id = ${val})`
                                } else {
                                    return `or category_id = ${val})`
                                }
                            } else {
                                if (JSON.stringify(product_name) == '{}') {
                                    return `or category_id = ${val}`
                                } else {
                                    return `or category_id = ${val}`
                                }
                            }
                        })

                        dbConf.query(`Select count(p.idproduct) as totalProductFilter from product p join category c on c.idcategory = p.category_id
                        where p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter.join(' ') : ''}
                        order by ${sort ? `${sort} asc` : `idproduct desc`} 
                        limit 10 offset 0`,
                            (err, results) => {
                                if (err) {
                                    return res.status(500).send(`Middlewear getTotalFilterProduct failed, error : ${err}`)
                                }

                                let totalProductFilter = results[0].totalProductFilter

                                // ${filterCategory || product_name ? 'where' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter.join(' ') : ''}

                                dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                                where s.isDefault="true" and p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter.join(' ') : ''}
                                order by ${sort ? `${sort} asc` : `idproduct desc`} 
                                    limit 10 offset ${dbConf.escape(offset)}`,
                                    (err, results) => {
                                        if (err) {
                                            return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                                        }

                                        res.status(200).send(
                                            {
                                                results,
                                                totalProduct,
                                                totalProductFilter
                                            }
                                        );
                                    })
                            }
                        )

                    } else {
                        let resultFilter = `category_id=${filterCategory}`;

                        dbConf.query(`Select count(p.idproduct) as totalProductFilter from product p join category c on c.idcategory = p.category_id
                        where p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                        order by ${sort ? `${sort} asc` : `idproduct desc`} 
                        ${typeof offset == typeof 'string' ? `limit ${dbConf.escape(limit)}` : `limit 10 offset 0`}`,
                            (err, results) => {
                                if (err) {
                                    return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                                }

                                let totalProductFilter = results[0].totalProductFilter

                                // ${filterCategory || product_name ? 'where' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}

                                dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                                where s.isDefault="true" and p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                    order by ${sort ? `${sort} asc` : `idproduct desc`} 
                    ${typeof offset == typeof 'string' ? `limit ${dbConf.escape(limit)}` : `limit 10 offset ${dbConf.escape(offset)}`}`,
                                    (err, results) => {
                                        if (err) {
                                            return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                                        }

                                        res.status(200).send(
                                            {
                                                results,
                                                totalProduct,
                                                totalProductFilter
                                            }
                                        );
                                    })
                            }
                        )
                    }
                } else if ((typeof offset != typeof 'string' || limit) && !filterCategory) { // Before : else if (limit)
                    let resultFilter = `category_id=${filterCategory}`;

                    dbConf.query(`Select count(p.idproduct) as totalProductFilter from product p join category c on c.idcategory = p.category_id
                    where p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter.join(' ') : ''}
                        order by ${sort ? `${sort} asc` : `idproduct desc`} 
                        limit 10 offset 0`,
                        (err, results) => {
                            if (err) {
                                return res.status(500).send(`Middlewear getTotalFilterProduct failed, error : ${err}`)
                            }

                            let totalProductFilter = results[0].totalProductFilter

                            // ${filterCategory || product_name ? 'where s.isDefault="true" and p.isDeleted="false"' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}


                            dbConf.query(`Select p.*, c.category_name, s.stock_unit from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                    where s.isDefault="true" and p.isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                    order by ${sort ? `${sort} asc` : limit ? `s.stock_unit desc` : `p.idproduct desc`} 
                    ${typeof offset == typeof 'string' ? `limit ${dbConf.escape(limit)}` : `limit 10 offset ${dbConf.escape(offset)}`}`,
                                (err, results) => {
                                    if (err) {
                                        return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                                    }

                                    res.status(200).send(
                                        {
                                            results,
                                            totalProduct,
                                            totalProductFilter
                                        }
                                    );
                                })
                        })
                } else {
                    let resultFilter = `category_id=${filterCategory}`;

                    dbConf.query(`Select p.*, c.category_name, s.* from product p join category c on c.idcategory = p.category_id join stock s on p.idproduct=s.product_id
                    where isDeleted="false" ${filterCategory || product_name ? 'and' : ''} ${product_name ? `product_name like ('%${product_name}%')` : ''} ${product_name && filterCategory ? 'and' : ''} ${filterCategory ? resultFilter : ''}
                    ${sort ? `order by ${sort} asc` : ``}`,
                        (err, results) => {
                            if (err) {
                                return res.status(500).send(`Middlewear getProduct failed, error : ${err}`)
                            }
                            res.status(200).send(
                                {
                                    results,
                                    totalProduct
                                }
                            );
                        })
                }

            })
    },
    addProduct: (req, res, next) => {
        let image = `/imgProductPict/${req.files[0].filename}`;
        let { product_name, price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit } = JSON.parse(req.body.data);

        dbConf.query(`Select * from product where product_name=${dbConf.escape(product_name)}`,
            (err, result) => {
                if (err) {
                    return res.status(500).send('Middlewear addProduct failed, error', err)
                }

                if (JSON.stringify(result) == '[]') {
                    dbConf.query(`Insert into product (product_name, price, category_id, netto_stock, netto_unit, default_unit, picture, description, dosis, aturan_pakai) 
                    values (${dbConf.escape(product_name)},${dbConf.escape(price)},${dbConf.escape(category_id)},${dbConf.escape(netto_stock)},${dbConf.escape(netto_unit)},${dbConf.escape(default_unit)},${dbConf.escape(image)},${dbConf.escape(description)},${dbConf.escape(dosis)},${dbConf.escape(aturan_pakai)})`,
                        (err, results) => {
                            if (err) {
                                return res.status(500).send(`Middlewear addProduct failed, error : ${err}`)
                            }

                            dbConf.query(`Select idproduct from product where product_name='${product_name}'`,
                                (e, r) => {
                                    if (e) {
                                        return res.status(500).send(`Middlewear addProduct failed, error : ${e}`)
                                    }

                                    resultAddproduct = {
                                        product_id: r[0].idproduct,
                                        stock_unit,
                                        unit: default_unit
                                    };

                                    next()

                                })
                        })
                } else {
                    res.status(200).send({
                        success: false,
                        message: 'Product already existed, please input another name'
                    })
                }
            })
    },
    addStock: (req, res) => {
        let { product_id, stock_unit, unit } = resultAddproduct;

        dbConf.query(`Insert into stock (stock_unit, unit, isDefault, product_id)
        values (${dbConf.escape(stock_unit)},${dbConf.escape(unit)},'true',${dbConf.escape(product_id)})`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear addProduct failed, error : ${error}`)
                }

                res.status(200).send({
                    success: true,
                    message: 'Product Added'
                })
            })
    },
    deleteProduct: (req, res) => {
        let idproduct = req.params.id;

        dbConf.query(`Update product set isDeleted="true" where idproduct=${dbConf.escape(idproduct)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    editProduct: (req, res) => {
        // Tika Change #4
        // Definisi variabel pindah ke stockHistory 
        // Karena ada penambahan route ke MW stockHistory sebelum ke MW editProduct

        // Before : definisi variabel di sini
        // let idproduct = req.params.id;
        // let image = `/imgProductPict/${req.files[0].filename}`;
        // let { iduser, price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit, unit } = JSON.parse(req.body.data);
        // let { price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit, unit } = JSON.parse(req.body.data);

        // After : ambil dari result MW stockHistory
        let { image, iduser, idproduct, price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit, unit } = resultEditproduct;

        dbConf.query(`UPDATE product p, stock s
        SET p.price=${dbConf.escape(price)},
            p.category_id=${dbConf.escape(category_id)},
            p.netto_stock=${dbConf.escape(netto_stock)},
            p.netto_unit=${dbConf.escape(netto_unit)},
            p.default_unit=${dbConf.escape(default_unit)},
            p.picture=${dbConf.escape(image)},
            p.description=${dbConf.escape(description)},
            p.dosis=${dbConf.escape(dosis)},
            p.aturan_pakai=${dbConf.escape(aturan_pakai)},
            s.stock_unit=${dbConf.escape(stock_unit)},
            s.unit=${dbConf.escape(unit)}
        WHERE
            p.idproduct = ${dbConf.escape(idproduct)}
            AND s.product_id = ${dbConf.escape(idproduct)}`,
            (error, results) => {
                if (error) {
                    res.status(500).send(`Middleware query edit product gagal :`, error);
                }

                res.status(200).send(results);
            })
    },
    getCategory: (req, res) => {
        dbConf.query(`Select * from category`,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getCategory failed, error :', err)
                }

                res.status(200).send(results);
            })
    },
    getUnit: (req, res) => {
        let unit_type = req.query.unit_type;

        dbConf.query(`Select * from unit where unit_type=${dbConf.escape(unit_type)}`,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getUnit failed. Error :', err)
                }
                res.status(200).send(results);
            })
    },
    addUnit: (req, res) => {
        let unit_type = req.query.unit_type;
        let unit = req.body.unit;

        dbConf.query(`Select * from unit where unit=${dbConf.escape(unit)} `,
            (err, results) => {
                if (err) {
                    return res.status(500).send('Middlewear getUnit failed. Error :', err)
                }

                if (JSON.stringify(results) != '[]') {
                    res.status(200).send({
                        message: false
                    })
                } else {
                    dbConf.query(`Insert into unit (unit_type, unit) values (${dbConf.escape(unit_type)}, ${dbConf.escape(unit)})`,
                        (err, results) => {
                            if (err) {
                                res.status(500).send('Middlewear addUnit failed:', err)
                            }
                            res.status(200).send({
                                ...results,
                                message: true
                            });
                        })
                }
            })
    },
    deleteUnit: (req, res) => {
        let idunit = req.params.id;

        dbConf.query(`Delete from unit where idunit=${dbConf.escape(idunit)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    addCategory: (req, res) => {
        let category_name = req.body.category_name;

        dbConf.query(`Select * from category where category_name=${dbConf.escape(category_name)}`,
            (err, results) => {
                if (err) {
                    res.send(500).status('Middlewear addCategory gagal :', error)
                }

                if (JSON.stringify(results) != '[]') {
                    res.status(200).send({
                        message: false
                    })
                } else {
                    dbConf.query(`Insert into category (category_name) values (${dbConf.escape(category_name)})`,
                        (err, results) => {
                            if (err) {
                                res.send(500).status('Middlewear addCategory gagal :', error)
                            }

                            res.status(200).send({
                                ...results,
                                message: true
                            })
                        })
                }
            })
    },
    editCategory: (req, res) => {
        let idcategory = req.params.id;
        let category_name = req.body.category_name;

        dbConf.query(`Update category set category_name=${dbConf.escape(category_name)} where idcategory=${dbConf.escape(idcategory)}`,
            (err, results) => {
                if (err) {
                    res.status(500).send('Middlewear editcategory gagal :', err)
                }

                res.send(200).status({
                    ...results,
                    message: true
                })
            })
    },
    deleteCategory: (req, res) => {
        let idcategory = req.params.id;

        dbConf.query(`Delete from category where idcategory=${dbConf.escape(idcategory)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                if (results.affectedRows) {
                    res.status(200).send(
                        {
                            message: true
                        })
                } else {
                    res.status(200).send(
                        {
                            message: false
                        })
                }

            })
    },
    getcartdata: async (req, res) => {
        try {
            let getSql = await dbQuery(`SELECT * FROM cart c 
            JOIN product p ON c.product_id = p.idproduct 
            JOIN stock s ON s.product_id = p.idproduct
            WHERE c.user_id = ${dbConf.escape(req.dataToken.iduser)}
            AND s.isDefault = 'true'
            ORDER BY c.idcart DESC;`);

            res.status(200).send(getSql);
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    deletecart: async (req, res) => {
        try {
            console.log(req.params)
            await dbQuery(`DELETE FROM cart WHERE idcart=${dbConf.escape(req.params.idcart)};`);
            res.status(200).send({
                success: true,
                message: 'Delete Success'
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    updatecart: async (req, res) => {
        try {
            // console.log(req.body)
            if (req.body.selected) {
                if (req.body.selectAll) {
                    // checkbox all
                    await dbQuery(`UPDATE cart SET selected=${dbConf.escape(req.body.selected)} WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                } else {
                    // checkbox satu item
                    await dbQuery(`UPDATE cart SET selected=${dbConf.escape(req.body.selected)} WHERE idcart=${dbConf.escape(req.body.idcart)};`);
                }
            } else {
                if (req.body.multiple) {
                    console.log('multiple exist', req.body);
                    await dbQuery(`UPDATE cart SET selected = 'false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                    req.body.exist.forEach(async (val, idx) => {
                        await dbQuery(`UPDATE cart SET quantity = quantity + ${dbConf.escape(val.qty)}, selected = 'true' WHERE idcart=${dbConf.escape(val.idcart)};`);
                    })
                } else {
                    await dbQuery(`UPDATE cart SET selected = 'false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                    await dbQuery(`UPDATE cart SET quantity=${dbConf.escape(req.body.newQty)}, selected = 'true' WHERE idcart=${dbConf.escape(req.body.idcart)};`);
                }
            }
            res.status(200).send({
                success: true,
                message: 'Update Success'
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addCart: async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.dataToken);
            if (req.body.multiple) {
                console.log('multiple new', req.body);
                await dbQuery(`UPDATE cart SET selected = 'false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                let comp = [];
                req.body.new.forEach(async (val, idx) => {
                    comp.push(`(${dbConf.escape(req.dataToken.iduser)}, ${dbConf.escape(val.idproduct)}, ${dbConf.escape(val.qty)}, 'true')`);
                });
                await dbQuery(`INSERT INTO cart (user_id, product_id, quantity, selected) VALUES ${comp.join(', ')};`);

            } else {
                // single income data
                await dbQuery(`UPDATE cart SET selected = 'false' WHERE user_id = ${dbConf.escape(req.dataToken.iduser)};`);
                await dbQuery(`INSERT INTO cart (user_id, product_id, quantity, selected) VALUES (${dbConf.escape(req.dataToken.iduser)}, ${dbConf.escape(req.body.idproduct)}, ${dbConf.escape(req.body.newQty)}, 'true');`);
            }
            res.status(200).send({
                success: true,
                message: 'Product Added'
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    stockHistory: (req, res, next) => {
        let image = JSON.stringify(req.files) != '[]' ? `/imgProductPict/${req.files[0].filename}` : req.body.images;
        let { iduser, price, category_id, netto_stock, netto_unit, default_unit, description, dosis, aturan_pakai, stock_unit, unit } = JSON.parse(req.body.data);
        let idproduct = req.params.id;

        dbConf.query(`Select *,p.product_name from stock s join product p on s.product_id = p.idproduct where s.product_id = ${dbConf.escape(idproduct)} and s.isDefault ='true'`,

            // dbConf.query(`Select *,p.product_name from stock s join product p on s.product_id = p.idproduct where s.product_id = ${idproduct} and s.isDefault ='true'`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear stockHistory failed, error : ${err}`)
                }

                if (results[0].stock_unit > stock_unit) {
                    // dbConf.query(`INSERT INTO history_stock (product_name, user_id, unit, quantity, type, information) VALUES
                    dbConf.query(`INSERT INTO history_stock (product_name, user_id, unit, quantity,date, type, information) VALUES
                    (${dbConf.escape(results[0].product_name)},${dbConf.escape(iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(results[0].stock_unit - stock_unit)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Manual Update','Pengurangan')`,

                        // (${dbConf.escape(results[0].product_name)},${dbConf.escape(req.body.data.iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(results[0].stock_unit - req.body.data.stock_unit)},'Manual Update','Pengurangan')`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(`Middlewear stockHistory failed, error : ${error}`)
                            }

                            resultEditproduct = {
                                image,
                                iduser,
                                idproduct,
                                price,
                                category_id,
                                netto_stock,
                                netto_unit,
                                default_unit,
                                description,
                                dosis,
                                aturan_pakai,
                                stock_unit,
                                unit
                            };

                            next()
                        })
                } else if (results[0].stock_unit < stock_unit) {
                    dbConf.query(`INSERT INTO history_stock (product_name, user_id, unit, quantity,date, type, information) VALUES
                (${dbConf.escape(results[0].product_name)},${dbConf.escape(iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(stock_unit - results[0].stock_unit)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Manual Update','Penambahan');`,

                        // (${dbConf.escape(results[0].product_name)},${dbConf.escape(req.body.data.iduser)},${dbConf.escape(results[0].unit)},${dbConf.escape(req.body.data.stock_unit - results[0].stock_unit)},'Manual Update','Penambahan');`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(`Middlewear stockHistory failed, error : ${error}`)
                            }

                            resultEditproduct = {
                                image,
                                iduser,
                                idproduct,
                                price,
                                category_id,
                                netto_stock,
                                netto_unit,
                                default_unit,
                                description,
                                dosis,
                                aturan_pakai,
                                stock_unit,
                                unit
                            };

                            next()
                        })
                } else {

                    resultEditproduct = {
                        image,
                        iduser,
                        idproduct,
                        price,
                        category_id,
                        netto_stock,
                        netto_unit,
                        default_unit,
                        description,
                        dosis,
                        aturan_pakai,
                        stock_unit,
                        unit
                    };

                    next()
                }
            })
    },
    unitConv: async (req, res) => {
        try {
            if (req.body.status == 'already') {
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.main)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='true';`);
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.conv)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='false';`);
                await dbQuery(`INSERT INTO history_stock (product_name, user_id,unit,quantity,date, type,information) VALUES
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.mainUnit)},${dbConf.escape(req.body.change_main)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Unit Conversion','Pengurangan'),
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.convUnit)},${dbConf.escape(req.body.change_conv)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Unit Conversion','Penambahan');`)
            } else {
                await dbQuery(`UPDATE stock SET stock_unit=${dbConf.escape(req.body.main)} WHERE product_id=${dbConf.escape(req.body.idproduct)} AND isDefault='true';`);
                await dbQuery(`insert into stock (stock_unit,unit,isDefault,product_id) values (${dbConf.escape(req.body.conv)},${dbConf.escape(req.body.convUnit)},'false',${dbConf.escape(req.body.idproduct)});`);
                await dbQuery(`INSERT INTO history_stock (product_name, user_id,unit,quantity,date, type,information) VALUES
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.mainUnit)},${dbConf.escape(req.body.change_main)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Unit Conversion','Pengurangan'),
                (${dbConf.escape(req.body.name)},${dbConf.escape(req.body.iduser)},${dbConf.escape(req.body.convUnit)},${dbConf.escape(req.body.conv)},'${new Date().toLocaleDateString('en-CA')} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}','Unit Conversion','Penambahan');`)
            }
            res.status(200).send({
                success: true,
                message: 'Unit Conversion Success'
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
};