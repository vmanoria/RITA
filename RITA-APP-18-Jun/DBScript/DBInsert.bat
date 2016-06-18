# Input Files

mongoimport --collection CustomerDemographicProfile --db RITA-DB --type csv --headerline --file CustomerDemographicProfile.csv
mongoimport --collection CustomerPortfolioProfile --db RITA-DB --type csv --headerline --file CustomerPortfolioProfile.csv
mongoimport --collection CustomerRiskProfile --db RITA-DB --type csv --headerline --file CustomerRiskProfile.csv
mongoimport --collection CustomerTransactionData --db RITA-DB --type csv --headerline --file CustomerTransactionData.csv
mongoimport --collection SecurityIndustrySegments --db RITA-DB --type csv --headerline --file SecurityIndustrySegments.csv

# Output Files (Reports)

mongoimport --collection VenkatPnLRport --db RITA-DB --type csv --headerline --file VenkatPnLRport.csv
mongoimport --collection PratapPnLRport --db RITA-DB --type csv --headerline --file PratapPnLRport.csv
mongoimport --collection LakshmiPnLRport --db RITA-DB --type csv --headerline --file LakshmiPnLRport.csv
mongoimport --collection SaikiranPnLRport --db RITA-DB --type csv --headerline --file SaikiranPnLRport.csv

mongoimport --collection CustomerProfile --db RITA-DB --type csv --headerline --file CustomerProfile.csv

mongoimport --collection VenkatTransactionStatus --db RITA-DB --type csv --headerline --file VenkatTransactionStatus.csv
mongoimport --collection PratapTransactionStatus --db RITA-DB --type csv --headerline --file PratapTransactionStatus.csv
mongoimport --collection LakshmiTransactionStatus --db RITA-DB --type csv --headerline --file LakshmiTransactionStatus.csv
mongoimport --collection SaikiranTransactionStatus --db RITA-DB --type csv --headerline --file SaikiranTransactionStatus.csv

mongoimport --collection VenkatICR --db RITA-DB --type csv --headerline --file VenkatICR.csv
mongoimport --collection PratapICR --db RITA-DB --type csv --headerline --file PratapICR.csv
mongoimport --collection LakshmiICR --db RITA-DB --type csv --headerline --file LakshmiICR.csv
mongoimport --collection SaikiranICR --db RITA-DB --type csv --headerline --file SaikiranICR.csv


mongoimport --host 169.44.118.232 --collection CustomerStockData --db RITA-DB --file rita-update-db.json