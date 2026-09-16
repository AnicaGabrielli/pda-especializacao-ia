// Gerado por IA. Colado sem ler. (LAB 3 — a tarefa real é aqui)
//
// Valida um CPF brasileiro (com ou sem máscara).
// Retorna true se o CPF for válido, false caso contrário.

export function validaCpf(cpf) {
  if (typeof cpf !== 'string') return false;

  const digitos = cpf.replace(/[.\-\s]/g, '');
  if (!/^\d{11}$/.test(digitos)) return false;
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  const nums = digitos.split('').map((d) => parseInt(d, 10));

  const calcDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const dv1 = calcDigito(nums.slice(0, 9));
  const dv2 = calcDigito(nums.slice(0, 10));

  return dv1 === nums[9] && dv2 === nums[10];
}
