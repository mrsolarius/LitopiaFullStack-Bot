CREATE TABLE MEMBERS (
    idDiscord CHAR(18),
    minecraftUUID CHAR(32),
    discordNickname VARCHAR(32),
    minecraftNickname VARCHAR(16),
    candidature TEXT,
    candidatatureDate TIMESTAMP,
    acceptedate TIMESTAMP,
    roleName VARCHAR(100),
    playTime VARCHAR(256),
    timeSinceLastDeath VARCHAR(256),
    numberDeath INTEGER,
    numberJump INTEGER,
    totalMobKill INTEGER,
    totalPlayerKill INTEGER,
    totalParcourDistance NUMERIC(10,3),
    lastUpdate DATE,
    PRIMARY KEY(idDiscord,minecraftUUID)
);

CREATE TABLE Item(
    item VARCHAR(256),
    nom VARCHAR(256),
    PRIMARY KEY (item)
);

CREATE TABLE ItemStat(
    idDiscord CHAR(18),
    minecraftUUID CHAR(32),
    item VARCHAR(256),
    numberCraft INTEGER,
    numberUsed INTEGER,
    numberMine INTEGER,
    numberBroken INTEGER,
    PRIMARY KEY (idDiscord,minecraftUUID,item),
    CONSTRAINT Fk_item FOREIGN KEY (item) REFERENCES Item(item), 
    CONSTRAINT Fk_item_member FOREIGN KEY (idDiscord,minecraftUUID) REFERENCES MEMBERS(idDiscord,minecraftUUID)
);

CREATE TABLE Mob(
    mob VARCHAR(256),
    nom VARCHAR(256),
    PRIMARY KEY (mob)
);

CREATE TABLE MobStat(
    idDiscord CHAR(18),
    minecraftUUID CHAR(32),
    mob VARCHAR(256),
    killed INTEGER,
    murder INTEGER,
    PRIMARY KEY (idDiscord,minecraftUUID,mob),
    CONSTRAINT Fk_mob FOREIGN KEY (mob) REFERENCES Mob(Mob),
    CONSTRAINT Fk_mob_member FOREIGN KEY (idDiscord,minecraftUUID) REFERENCES MEMBERS(idDiscord,minecraftUUID)
);


/*
CREATE TABLE ROLE(
    idDiscord CHAR(18),
    minecraftUID CHAR(32),
    discordRolesID CHAR(18),
    roleName CHAR(100),
    PRIMARY KEY (discordRolesID)
);

CREATE TABLE MEMBERROLES(
    idDiscord CHAR(18),
    minecraftUID CHAR(32),
    discordRolesID CHAR(18),
    CONSTRAINT Fk_member FOREIGN KEY (idDiscord,minecraftUID) REFERENCES MEMBER(idDiscord,minecraftUID),
    CONSTRAINT Fk_role FOREIGN KEY (discordRolesID) REFERENCES ROLE(discordRolesID),
    PRIMARY KEY (idDiscord,minecraftUID,discordRolesID)    
);

insert into role values('482612660962197544','✍ Attente Candidature ✍');
insert into role values('721985586000429106','📡 Traitement de la candidature 📡');
insert into role values('482240339399409674','Attente Vote ★');
insert into role values('482160064959086606','Attente Entretien ★ ★');
insert into role values('482159006928863252','☢ Période d''essai ☢');
insert into role values('390447376986275842','♞ Litopien ♞');
*/